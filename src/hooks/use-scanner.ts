import { useState } from 'react';
import { getTokenHolders } from '@/lib/solana/token';
import type { TokenHolder } from '@/types/token';

export function useScannerState() {
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (address: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const holders = await getTokenHolders(address);
      setHolders(holders);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch token data';
      setError(message);
      setHolders([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    holders,
    isLoading,
    error,
    handleSearch
  };
}