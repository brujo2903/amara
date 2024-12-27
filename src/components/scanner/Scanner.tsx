import { type FC, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getTokenHolders } from '@/lib/solana/token';
import { TokenHolderList } from './TokenHolderList';
import { WalletsListButton } from './WalletsListButton';
import type { TokenHolder } from '@/types/token';

export const Scanner: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const address = location.state?.address;
    if (!address) {
      navigate('/scanning');
      return;
    }

    const fetchHolders = async () => {
      setError(null);
      setHolders([]);
      setIsLoading(true);

      try {
        const holders = await getTokenHolders(address);
        setHolders(holders);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch token data. Please try again later.');
        }
        setTimeout(() => navigate('/scanning'), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHolders();
  }, [location.state?.address, navigate]);

  if (error) {
    return (
      <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/90 backdrop-blur-md"
      )}>
        <div className={cn(
          "p-6 text-center animate-fade-in",
          "bg-red-950/40 border border-red-600/30 rounded-lg",
          "text-red-400 font-['VT323'] text-xl",
          "shadow-[0_0_20px_rgba(220,38,38,0.2)]"
        )}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md">
      <WalletsListButton holders={holders} />
      <TokenHolderList holders={holders} isLoading={isLoading} />
    </div>
  );
};