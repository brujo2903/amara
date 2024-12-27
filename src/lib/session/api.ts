import { supabase } from '@/lib/supabase';
import { storeSession, clearSession } from './storage';
import type { Session } from './types';

export async function createSession(): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({})
    .select()
    .single();

  if (error) {
    console.error('Failed to create session:', error);
    throw new Error('Failed to create session');
  }

  const session = {
    id: data.id,
    token: data.token,
    created_at: data.created_at,
    expires_at: data.expires_at
  };

  storeSession(session);
  return session;
}

export async function getOrCreateSession(): Promise<Session> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const sessionData = {
        id: session.user.id,
        token: session.access_token,
        created_at: session.user.created_at,
        expires_at: new Date(session.expires_at!).toISOString()
      };
      storeSession(sessionData);
      return sessionData;
    }

    return await createSession();
  } catch (err) {
    console.error('Session error:', err);
    clearSession();
    throw new Error('Failed to initialize session');
  }
}