import { type FC } from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import type { TokenHolder } from '@/types/token';

interface HolderCardProps {
  holder?: TokenHolder;
  totalSupply: number;
  iconSrc: string;
  size?: 'sm' | 'md' | 'lg';
}

export const HolderCard: FC<HolderCardProps> = ({
  holder,
  totalSupply,
  iconSrc,
  size = 'md'
}) => {
  const percentage = holder ? ((holder.amount / totalSupply) * 100).toFixed(2) : '0.00';
  
  return (
    <div className={cn(
      "relative group",
      "transition-all duration-300",
      size === 'sm' && "w-16 h-16",
      size === 'md' && "w-20 h-20",
      size === 'lg' && "w-24 h-24"
    )}>
      {holder ? (
        <a
          href={`https://solscan.io/account/${holder.wallet}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "block w-full h-full relative",
            "transition-all duration-300",
            "group-hover:scale-110",
            "group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          )}
        >
          <img
            src={iconSrc}
            alt="Holder Icon"
            className={cn(
              "w-full h-full object-contain",
              "transition-all duration-300",
              "drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]",
              "filter brightness-90 group-hover:brightness-110"
            )}
          />
          <div className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-black/90 backdrop-blur-md",
            "opacity-0 group-hover:opacity-100 rounded-lg",
            "transition-all duration-200",
            "shadow-[0_0_15px_rgba(220,38,38,0.2)]",
            "p-2"
          )}>
            <div className={cn(
              "text-center text-red-200 font-['VT323'] text-lg",
              "space-y-1"
            )}>
              <div className="text-sm truncate">{holder.wallet.slice(0, 4)}...{holder.wallet.slice(-4)}</div>
              <div className="text-red-400/70 text-xs">{percentage}%</div>
            </div>
          </div>
        </a>
      ) : (
        <div className={cn(
          "w-full h-full relative",
          "transition-all duration-300",
          "opacity-30"
        )}>
          <img
            src={iconSrc}
            alt="Empty Slot"
            className="w-full h-full object-contain filter grayscale"
          />
        </div>
      )}
    </div>
  );
};