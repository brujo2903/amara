export interface WebApp {
  id: string;
  name: string;
  description: string;
  code: {
    html?: string;
    css?: string;
    js?: string;
    config?: Record<string, any>;
  };
  owner_id: string;
  original_name?: string;
  preview_url?: string;
  created_at: string;
  updated_at: string;
}

export type WebAppFormData = Omit<WebApp, 'id' | 'created_at' | 'updated_at' | 'preview_url'>;