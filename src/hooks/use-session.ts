import { useState, useEffect } from 'react';
import { getOrCreateSession } from '@/lib/session/api';
import { getStoredSession } from '@/lib/session/storage';
import type { Session } from '@/lib/session/types';

export function useSession() {
  const [session, setSession] = useState<Session | null>(getStoredSession());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLoading(true);
        const session = await getOrCreateSession();
        setSession(session);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize session:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize session');
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (!session) {
      initSession();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  return {
    session,
    isLoading,
    error,
    isAuthenticated: !!session
  };
}