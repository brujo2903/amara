import type { Session } from './types';

export function getStoredSession(): Session | null {
  try {
    const stored = localStorage.getItem('session');
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error('Failed to parse stored session:', err);
    return null;
  }
}

export function storeSession(session: Session): void {
  localStorage.setItem('session', JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem('session');
}