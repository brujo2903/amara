import { type FC, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { TokenHolder } from '@/types/token';
import { ExternalLink } from 'lucide-react';

interface WalletsListButtonProps {
  holders?: TokenHolder[];
  totalSupply: number;
}

export const WalletsListButton: FC<WalletsListButtonProps> = ({ holders, totalSupply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasHolders = holders && holders.length > 0;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-4 right-8 z-[200]",
          "px-4 py-2 bg-violet-900/40 backdrop-blur-sm",
          "border border-violet-500/30 rounded-lg",
          "text-white font-['VT323'] text-xl",
          "shadow-[0_0_20px_rgba(139,92,246,0.3)]",
          "transition-all duration-200",
          "hover:bg-violet-800/40 hover:border-violet-400/50",
          "hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]",
          "cursor-pointer",
          "[image-rendering:pixelated]",
          "animate-fade-in",
          "flex items-center gap-2"
        )}
      >
        Wallets List
        {hasHolders && (
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed top-16 right-8 w-80 z-[201]",
              "bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-md",
              "border border-violet-500/30 rounded-lg",
              "shadow-[0_0_30px_rgba(139,92,246,0.3)]",
              "overflow-hidden"
            )}
          >
            <div className={cn(
              "p-4 max-h-[calc(100vh-8rem)]",
              "overflow-y-auto scrollbar-custom",
              "bg-gradient-to-b from-black/60 via-red-950/10 to-black/60"
            )}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={cn(
                  "text-white font-['VT323'] text-2xl font-bold",
                  "tracking-wider [text-shadow:0_0_10px_rgba(255,255,255,0.5)]",
                  "[image-rendering:pixelated]"
                )}>
                  Top 20 Holders {!hasHolders && '(Awaiting CA)'}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-red-200 hover:text-red-100 transition-colors",
                    "font-['VT323'] text-3xl rounded-full",
                    "hover:bg-red-900/20 w-8 h-8 flex items-center justify-center"
                  )}
                >
                  ×
                </button>
              </div>
              {hasHolders ? (
                <div className="space-y-2">
                  {holders.slice(0, 20).map((holder, index) => (
                    <a
                      key={holder.wallet}
                      href={`https://solscan.io/account/${holder.wallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center justify-between gap-4 group",
                        "p-2 rounded-lg transition-all duration-200",
                        "bg-black/40 border border-red-600/10",
                        "hover:bg-red-950/40 hover:border-red-500/30"
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
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-red-400/70 font-['VT323'] text-lg",
                          "group-hover:text-red-300/70 transition-colors"
                        )}>
                          {((holder.amount / totalSupply) * 100).toFixed(2)}%
                        </span>
                        <ExternalLink className="w-4 h-4 text-red-400/50 group-hover:text-red-300/50" />
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className={cn(
                  "text-center py-8",
                  "text-red-400/70 font-['VT323'] text-lg",
                  "animate-pulse"
                )}>
                  Enter a CA to view token holders
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};