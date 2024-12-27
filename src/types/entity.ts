export interface EntityMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Entity {
  id: string;
  name: string;
  mode: 'wild' | 'neutral' | 'safe';
  description: string;
  personality?: string;
  instruction?: string;
  knowledge?: string;
  avatar?: string;
  system_prompt: string;
  created_at: string;
}