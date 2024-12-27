export interface AnonymousUser {
  id: string;
  email: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface AuthError {
  code: string;
  message: string;
}