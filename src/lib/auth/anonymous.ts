import { supabase } from '@/lib/supabase';
import { generateAnonymousEmail, generateSecurePassword, generateUserId } from './utils';
import type { AnonymousUser } from './types';

export async function createAnonymousAccount(): Promise<{ user: AnonymousUser | null }> {
  try {
    const email = generateAnonymousEmail();
    const password = generateSecurePassword();
    const userId = generateUserId();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          id: userId,
          is_anonymous: true,
          created_at: new Date().toISOString()
        }
      }
    });

    if (error) {
      console.error('Anonymous signup error:', error);
      throw error;
    }

    if (!data.user) {
      throw new Error('No user data returned');
    }

    // Store anonymous user data in local storage
    localStorage.setItem('anonymousUser', JSON.stringify({
      id: userId,
      email,
      isAnonymous: true,
      createdAt: new Date().toISOString()
    }));

    return {
      user: {
        id: userId,
        email,
        isAnonymous: true,
        createdAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Failed to create anonymous account:', error);
    throw error;
  }
}

export async function getOrCreateAnonymousAccount() {
  try {
    // Check if user is already logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return { session };
    }

    // Check for existing anonymous user data
    const storedUser = localStorage.getItem('anonymousUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Try to sign in with stored credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.id // Using ID as password for stored users
      });

      if (!signInError && signInData.session) {
        return { session: signInData.session };
      }
    }

    // Create new anonymous account if no existing session or stored data
    return await createAnonymousAccount();
  } catch (error) {
    console.error('Auth error:', error);
    throw error;
  }
}

export async function clearAnonymousSession() {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem('anonymousUser');
  } catch (error) {
    console.error('Failed to clear anonymous session:', error);
    throw error;
  }
}