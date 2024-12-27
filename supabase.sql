-- Create auth schema and tables
-- Create auth.users table for Phantom wallet integration
-- Use built-in auth.users table from Supabase
alter table auth.users add column if not exists wallet_address text unique;
alter table auth.users add column if not exists nonce text;

-- Create entities table with proper auth references
create table if not exists public.entities (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  mode text not null check (mode in ('wild', 'neutral', 'safe')),
  description text not null,
  personality text,
  instruction text,
  knowledge text,
  avatar text,
  system_prompt text not null,
  avatar_loaded boolean default false,
  owner_id uuid references auth.users(id) on delete cascade,
  
  constraint valid_name check (char_length(name) >= 1 and char_length(name) <= 100),
  constraint valid_description check (char_length(description) >= 1),
  constraint unique_entity_name unique (name),
  constraint valid_avatar check (
    avatar is null or (
      avatar like 'data:image/%' 
      and length(avatar) <= 5 * 1024 * 1024
    )
  )
);

-- Create messages table with proper auth references
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  entity_id uuid not null references public.entities(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  user_id uuid references auth.users(id),
  
  constraint valid_content check (char_length(content) >= 1)
);

-- Create web_apps table with proper auth references
create table if not exists public.web_apps (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  original_name text not null,
  description text not null,
  type text not null default 'static',
  code jsonb not null default '{}'::jsonb,
  preview_url text,
  owner_id uuid not null references auth.users(id),
  published boolean default false,
  
  constraint valid_name check (char_length(name) >= 1 and char_length(name) <= 100),
  constraint valid_original_name check (char_length(original_name) >= 1),
  constraint unique_webapp_name unique (original_name),
  constraint valid_description check (char_length(description) >= 1),
  constraint valid_code check (jsonb_typeof(code) = 'object')
);

-- Create web_app_versions table with proper auth references
create table if not exists public.web_app_versions (
  id uuid default gen_random_uuid() primary key,
  web_app_id uuid not null references public.web_apps(id) on delete cascade,
  version_number integer not null,
  code jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id),
  commit_message text,
  
  constraint unique_version_number unique (web_app_id, version_number)
);

-- Enable Row Level Security
alter table auth.users enable row level security;
alter table public.entities enable row level security;
alter table public.messages enable row level security;
alter table public.web_apps enable row level security;
alter table public.web_app_versions enable row level security;

-- Note: auth.users policies are managed by Supabase Auth

-- Create policies for entities
create policy "Anyone can read entities"
  on public.entities for select
  using (true);

create policy "Authenticated users can create entities"
  on public.entities for insert
  with check (auth.role() = 'authenticated');

create policy "Only owner can update entities"
  on public.entities for update
  using (owner_id = auth.uid());

-- Create policies for messages
create policy "Anyone can read messages"
  on public.messages for select
  using (true);

create policy "Authenticated users can create messages"
  on public.messages for insert
  with check (auth.role() = 'authenticated');

-- Create policies for web_apps
create policy "Anyone can read published web_apps"
  on public.web_apps for select
  using (published = true or owner_id = auth.uid());
  
create policy "Authenticated users can create web_apps"
  on public.web_apps for insert
  with check (auth.role() = 'authenticated');

create policy "Only owner can update web_apps"
  on public.web_apps for update
  using (owner_id = auth.uid());

create policy "Only owner can delete web_apps"
  on public.web_apps for delete
  using (owner_id = auth.uid());

-- Create policies for web_app_versions
create policy "Anyone can read versions of published apps"
  on public.web_app_versions for select
  using (
    exists (
      select 1 from public.web_apps
      where id = web_app_id
      and (published = true or owner_id = auth.uid())
    )
  );

create policy "Only app owner can create versions"
  on public.web_app_versions for insert
  with check (
    exists (
      select 1 from public.web_apps
      where id = web_app_id
      and owner_id = auth.uid()
    )
  );

-- Create realtime replication
alter publication supabase_realtime add table public.entities;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.web_apps;
alter publication supabase_realtime add table public.web_app_versions;

-- Create indexes for better performance
create index if not exists entities_created_at_idx on public.entities(created_at desc);
create index if not exists messages_entity_id_created_at_idx on public.messages(entity_id, created_at desc);
create index if not exists web_apps_created_at_idx on public.web_apps(created_at desc);
create index if not exists web_apps_owner_id_idx on public.web_apps(owner_id);
create index if not exists web_app_versions_web_app_id_idx on public.web_app_versions(web_app_id);

-- Add function to update updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_web_apps_updated_at
  before update on public.web_apps
  for each row
  execute function update_updated_at_column();

-- Add function to cleanup old messages
create or replace function cleanup_old_messages()
returns trigger as $$
begin
  delete from public.messages
  where id in (
    select id from (
      select id,
      row_number() over (partition by entity_id order by created_at desc) as rn
      from public.messages
    ) sq
    where rn > 50
  );
  return null;
end;
$$ language plpgsql;

-- Create trigger for message cleanup
create trigger cleanup_messages_trigger
after insert on public.messages
execute function cleanup_old_messages();

-- Add function to handle version numbering
create or replace function handle_web_app_version()
returns trigger as $$
begin
  new.version_number = (
    select coalesce(max(version_number), 0) + 1
    from public.web_app_versions
    where web_app_id = new.web_app_id
  );
  return new;
end;
$$ language plpgsql;

-- Create trigger for version numbering
create trigger handle_web_app_version_trigger
before insert on public.web_app_versions
for each row
execute function handle_web_app_version();