-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create entities table without auth requirements
create table if not exists public.entities (
  id uuid default uuid_generate_v4() primary key,
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
  
  constraint valid_name check (char_length(name) >= 1 and char_length(name) <= 100),
  constraint valid_description check (char_length(description) >= 1),
  constraint unique_entity_name unique (name)
);

-- Create sessions table for anonymous users
create table if not exists public.sessions (
  id uuid default uuid_generate_v4() primary key,
  token text not null unique default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone default (now() + interval '30 days')
);

-- Create web_apps table with session_id
create table if not exists public.web_apps (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  original_name text not null,
  description text not null,
  code jsonb not null default '{}'::jsonb,
  preview_url text,
  session_id text not null,
  published boolean default false,
  
  constraint valid_name check (char_length(name) >= 1 and char_length(name) <= 100),
  constraint valid_original_name check (char_length(original_name) >= 1),
  constraint unique_webapp_name unique (original_name),
  constraint valid_description check (char_length(description) >= 1),
  constraint valid_code check (jsonb_typeof(code) = 'object')
);

-- Create function to update timestamps
create or replace function update_timestamps()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create function to clean expired sessions
create or replace function clean_expired_sessions()
returns trigger as $$
begin
  -- Also clean up related web apps when session expires
  delete from public.web_apps where session_id in (
    select id::text from public.sessions where expires_at < now()
  );
  delete from public.sessions where expires_at < now();
  return null;
end;
$$ language plpgsql;

-- Drop existing triggers
drop trigger if exists clean_expired_sessions_trigger on public.sessions;
drop trigger if exists update_web_apps_updated_at on public.web_apps;

-- Create triggers
create trigger clean_expired_sessions_trigger
  after insert or update on public.sessions
  execute function clean_expired_sessions();

create trigger update_web_apps_updated_at
  before update on public.web_apps
  for each row
  execute function update_timestamps();

-- Enable Row Level Security
alter table public.sessions enable row level security;
alter table public.web_apps enable row level security;
alter table public.entities enable row level security;

-- Drop existing policies
drop policy if exists "Anyone can create sessions" on public.sessions;
drop policy if exists "Users can read their own sessions" on public.sessions;
drop policy if exists "Users can update their own sessions" on public.sessions;
drop policy if exists "Anyone can read published web apps" on public.web_apps;
drop policy if exists "Session owners can create web apps" on public.web_apps;
drop policy if exists "Session owners can update their web apps" on public.web_apps;
drop policy if exists "Anyone can read entities" on public.entities;
drop policy if exists "Anyone can create entities" on public.entities;
drop policy if exists "Anyone can update entities" on public.entities;

-- Create RLS policies for sessions
create policy "Anyone can create sessions"
  on public.sessions for insert
  to anon, authenticated
  with check (true);

create policy "Users can read their own sessions"
  on public.sessions for select
  using (true);

create policy "Users can update their own sessions"
  on public.sessions for update
  using (true);

-- Create RLS policies for web apps
create policy "Anyone can read published web apps"
  on public.web_apps for select
  using (true);

create policy "Anyone can create web apps"
  on public.web_apps for insert
  with check (true);

create policy "Only owners can update web apps"
  on public.web_apps for update
  using (session_id = current_setting('request.session.id', true));
  
-- Create RLS policies for entities (open access)
create policy "Anyone can read entities"
  on public.entities for select
  using (true);

create policy "Anyone can create entities"
  on public.entities for insert
  with check (true);

create policy "Anyone can update entities"
  on public.entities for update
  using (true);

-- Create indexes
create index if not exists sessions_token_idx on public.sessions(token);
create index if not exists sessions_expires_at_idx on public.sessions(expires_at);
create index if not exists web_apps_session_id_idx on public.web_apps(session_id);
create index if not exists web_apps_created_at_idx on public.web_apps(created_at desc);
create index if not exists entities_created_at_idx on public.entities(created_at desc);

-- Enable realtime subscriptions
alter publication supabase_realtime add table public.web_apps;
alter publication supabase_realtime add table public.entities;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.sessions to anon, authenticated;
grant all on public.web_apps to anon, authenticated;
grant all on public.entities to anon, authenticated;
grant usage on all sequences in schema public to anon, authenticated;