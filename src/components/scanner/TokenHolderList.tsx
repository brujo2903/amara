import { type FC } from 'react';
import { cn } from '@/lib/utils';
import type { TokenHolder } from '@/lib/solana';
import { ExternalLink } from 'lucide-react';

const RANK_IMAGES = {
  1: 'https://imgur.com/JyXPB5A.jpg',
  2: 'https://imgur.com/LTB98zd.jpg',
  3: 'https://imgur.com/3tcMa6X.jpg',
  4: 'https://imgur.com/TZp57xh.jpg',
  5: 'https://imgur.com/ndVsTgE.jpg'
} as const;

interface TokenHolderListProps {
  holders: TokenHolder[];
  isLoading?: boolean;
}

export const TokenHolderList: FC<TokenHolderListProps> = ({ holders, isLoading }) => {
  if (isLoading) {
    return (
      <div className={cn(
        "fixed inset-0 z-[200]",
        "flex items-center justify-center",
        "bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-md"
      )}>
        <div className={cn(
          "animate-pulse text-violet-400 font-['VT323'] text-2xl",
          "flex flex-col items-center gap-4"
        )}>
          Scanning the void...
          <div className={cn(
            "w-64 h-1 bg-violet-900/30 rounded-full overflow-hidden",
            "border border-violet-500/30",
            "shadow-[0_0_15px_rgba(139,92,246,0.15)]"
          )}>
            <div className={cn(
              "h-full bg-gradient-to-r from-violet-600/50 to-violet-500/70",
              "animate-progress"
            )} />
          </div>
        </div>
      </div>
    );
  }

  if (!holders?.length) return null;

  // Group holders by rank
  const holdersByRank: Record<number, TokenHolder[]> = holders.reduce((acc, holder) => {
    if (!acc[holder.rank]) {
      acc[holder.rank] = [];
    }
    acc[holder.rank].push(holder);
    return acc;
  }, {});

  // Display ranks from highest to lowest
  return (
    <div className={cn(
      "min-h-screen overflow-y-auto scanner-page",
      "scrollbar-custom",
      "animate-fade-in"
    )}>
      {[5, 4, 3, 2, 1].map(rank => holdersByRank[rank]?.length > 0 && (
        <div 
          key={rank} 
          className={cn(
            "relative group min-h-screen w-full",
            "flex flex-col items-center justify-center",
            "snap-start snap-always",
            "p-8 bg-black/90"
          )}
        >
          {/* Tier Image - Full Width */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center",
            "transition-transform duration-300 pointer-events-none",
            "opacity-30 z-0",
            "group-hover:scale-105"
          )}>
            <img
              src={RANK_IMAGES[rank as keyof typeof RANK_IMAGES]}
              alt={`Tier ${rank}`}
              className={cn(
                "w-full h-full object-cover [image-rendering:pixelated]",
                "filter drop-shadow-[0_0_30px_rgba(139,92,246,0.4)]",
                "transition-all duration-300",
                "group-hover:drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]"
              )}
            />
            <div className={cn(
              "absolute top-8 left-1/2 -translate-x-1/2",
              "text-8xl font-['VT323'] font-bold tracking-wider",
              "bg-gradient-to-r from-pink-400 via-purple-400 to-violet-400",
              "bg-gradient-to-r from-pink-400 via-purple-400 to-violet-400",
              "bg-clip-text text-transparent",
              "opacity-90"
            )}>
              TIER {rank}
            </div>
          </div>

          {/* Holders Grid */}
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
            "w-full max-w-6xl mx-auto relative z-10"
          )}>
            {holdersByRank[rank].map((holder) => (
              <div
                key={holder.wallet}
                className={cn(
                  "group relative",
                  "bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-blue-900/40",
                  "bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-blue-900/40",
                  "border border-violet-500/30 rounded-lg p-4",
                  "backdrop-blur-sm transition-all duration-200",
                  "hover:bg-violet-900/40 hover:border-violet-400/50",
                  "hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]",
                  "[image-rendering:pixelated]",
                  "transform hover:scale-[1.02]",
                  "animate-fade-in"
                )}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://imgur.com/uwH0O77.jpg"
                    alt="Holder Icon"
                    className={cn(
                      "w-10 h-10 object-contain",
                      "transition-transform duration-200",
                      "group-hover:scale-110"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "text-violet-200 font-['VT323'] text-lg truncate",
                      "group-hover:text-violet-100 transition-colors"
                    )}>
                      {holder.wallet.slice(0, 4)}...{holder.wallet.slice(-4)}
                    </div>
                    <div className="text-violet-400/70 font-['VT323'] text-sm">
                      {holder.amount.toLocaleString(undefined, {
                        maximumFractionDigits: 2
                      })}
                    </div>
                  </div>
                </div>

                <a
                  href={`https://solscan.io/account/${holder.wallet}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "absolute inset-0 flex items-center justify-center",
                    "bg-black/80 backdrop-blur-sm",
                    "opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-200 z-20"
                  )}
                >
                  <div className={cn(
                    "flex items-center gap-2",
                    "text-red-200 font-['VT323'] text-lg"
                  )}>
                    <ExternalLink className="w-5 h-5" />
                    View on Solscan
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};