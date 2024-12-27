import { type FC } from 'react';
import { cn } from '@/lib/utils';
import { HolderCard } from './HolderCard';
import type { TokenHolder } from '@/types/token';

interface TierSectionProps {
  tier: number;
  holders: TokenHolder[];
  totalSupply: number;
  backgroundImage: string;
  icons: string[];
}

export const TierSection: FC<TierSectionProps> = ({
  tier,
  holders,
  totalSupply,
  backgroundImage,
  icons
}) => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div className={cn(
        "absolute inset-0 bg-cover bg-center bg-no-repeat",
        "opacity-20 transition-opacity duration-300",
        "[image-rendering:pixelated]"
      )}
      style={{ backgroundImage: `url(${backgroundImage})` }} />

      {/* Tier Text */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "pointer-events-none select-none z-0"
      )}>
        <div className={cn(
          "relative font-['VT323'] text-[15rem] leading-none",
          "text-transparent bg-clip-text",
          "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
          "animate-pulse-slow",
          "[text-shadow:0_0_40px_rgba(139,92,246,0.2)]",
          "after:absolute after:inset-0",
          "after:bg-gradient-to-b after:from-black/0 after:via-violet-500/5 after:to-black/0",
          "after:animate-pulse-slow after:blur-xl"
        )}>
          TIER {tier}
        </div>
        <div className={cn(
          "absolute inset-0 blur-3xl opacity-30",
          "bg-gradient-to-r from-pink-500/20 via-purple-500/15 to-indigo-500/10",
          "animate-pulse-slow"
        )} />
      </div>

      {/* Holders Grid */}
      <div className={cn(
        "relative z-10 min-h-screen",
        "flex items-center justify-center",
        "p-8"
      )}>
        <div className={cn(
          "grid grid-cols-auto-fit gap-6",
          "place-items-center content-center",
          "w-full max-w-6xl mx-auto"
        )}>
          {holders.map((holder, index) => (
            <HolderCard
              key={holder.wallet}
              holder={holder}
              totalSupply={totalSupply}
              iconSrc={icons[index % icons.length]}
              size={tier === 5 ? 'lg' : tier >= 3 ? 'md' : 'sm'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};