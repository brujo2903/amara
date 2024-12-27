import { useState, useEffect, useCallback } from 'react';
import { getOrCreateSession, clearSession } from '@/lib/auth/session';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function useAutoAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const authenticate = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { session } = await getOrCreateSession();
      
      if (!session) {
        throw new Error('Failed to create session');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to authenticate';
      setError(message);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  const retry = useCallback(() => {
    authenticate();
  }, [authenticate]);

  return { isLoading, error, retry };
}