import { type FC } from 'react';
import { cn } from '@/lib/utils';
import type { TokenHolder } from '@/types/token';

interface TopHoldersListProps {
  holders: TokenHolder[];
}

export const TopHoldersList: FC<TopHoldersListProps> = ({ holders }) => {
  const topHolders = holders.slice(0, 20);

  return (
    <div className={cn(
      "fixed top-4 right-4 z-[100]",
      "bg-black/40 backdrop-blur-sm",
      "p-4 rounded-lg border border-red-600/30",
      "shadow-[0_0_20px_rgba(220,38,38,0.2)]",
      "animate-fade-in",
      "max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-custom"
    )}>
      <h2 className={cn(
        "text-white font-['VT323'] text-2xl font-bold mb-4",
        "tracking-wider [text-shadow:0_0_10px_rgba(255,255,255,0.5)]",
        "[image-rendering:pixelated]"
      )}>
        Top 20 Holders
      </h2>

      <div className="space-y-2">
        {topHolders.map((holder, index) => (
          <div
            key={holder.wallet}
            className={cn(
              "flex items-center justify-between gap-4",
              "p-2 rounded transition-colors",
              "hover:bg-red-900/20 group"
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-red-400 font-['VT323'] text-lg",
                "min-w-[2ch] text-right"
              )}>
                #{index + 1}
              </span>
              <span className={cn(
                "text-red-200 font-['VT323'] text-lg",
                "group-hover:text-red-100 transition-colors"
              )}>
                {holder.wallet.slice(0, 4)}...{holder.wallet.slice(-4)}
              </span>
            </div>
            <span className={cn(
              "text-red-400/70 font-['VT323'] text-lg",
              "group-hover:text-red-300/70 transition-colors"
            )}>
              {(holder.amount / holders.reduce((sum, h) => sum + h.amount, 0) * 100).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};