import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

export interface Session {
  id: string;
  token: string;
  created_at: string;
  expires_at: string;
}

export async function getOrCreateSession(): Promise<{ session: Session }> {
  try {
    // Check for existing session in localStorage
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      const session = JSON.parse(storedSession);
      // Check if session is expired
      if (new Date(session.expires_at) > new Date()) {
        return { session };
      }
      // Clear expired session
      localStorage.removeItem('session');
    }

    // Create new session
    const { data, error } = await supabase
      .from('sessions')
      .insert([{}])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create session');

    // Set session token in auth context
    await supabase.auth.setSession({
      access_token: data.token,
      refresh_token: ''
    });

    const session = {
      id: data.id,
      token: data.token,
      created_at: data.created_at,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Store in localStorage
    localStorage.setItem('session', JSON.stringify(session));

    return { session };
  } catch (error) {
    console.error('Session error:', error);
    throw error;
  }
}

export function clearSession() {
  localStorage.removeItem('session');
}