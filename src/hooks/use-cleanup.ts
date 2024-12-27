import { useCallback, useRef } from 'react';

export function useCleanup() {
  const timeouts = useRef<Set<NodeJS.Timeout>>(new Set());

  const setTimeout = useCallback((fn: () => void, delay: number) => {
    const timeout = window.setTimeout(() => {
      timeouts.current.delete(timeout);
      fn();
    }, delay);
    timeouts.current.add(timeout);
    return timeout;
  }, []);

  const clear = useCallback(() => {
    timeouts.current.forEach(timeout => window.clearTimeout(timeout));
    timeouts.current.clear();
  }, []);

  return { setTimeout, clear };
}