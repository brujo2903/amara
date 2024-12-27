export interface Session {
  id: string;
  token: string;
  created_at: string;
  expires_at: string;
}

export interface SessionError {
  code: string;
  message: string;
  details?: unknown;
}