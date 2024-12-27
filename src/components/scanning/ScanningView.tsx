import { type FC, useState } from 'react';
import { cn } from '@/lib/utils';
import { TIER_IMAGES, TIER_ICONS } from '@/lib/constants';
import { useScannerState } from '@/hooks/use-scanner';
import { ComingSoonOverlay } from '@/components/web/ComingSoonOverlay';
import { ScannerHeader } from './ScannerHeader';
import { SearchDialog } from '@/components/scanner/SearchDialog';
import { WalletsListButton } from '@/components/scanner/WalletsListButton';
import { TierSection } from './TierSection';

export const ScanningView: FC = () => {
  const { holders, isLoading, error, handleSearch } = useScannerState();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const totalSupply = holders.length > 0 
    ? holders.reduce((sum, holder) => sum + holder.amount, 0)
    : 0;

  return (
    <div className="fixed inset-0 bg-black">
      <ComingSoonOverlay 
        show={showComingSoon} 
        onComplete={() => setShowComingSoon(false)} 
      />

      <ScannerHeader onSearchClick={() => setShowSearch(true)} />
      
      <SearchDialog 
        open={showSearch}
        onOpenChange={setShowSearch}
        onSearch={handleSearch}
      />

      <WalletsListButton 
        holders={holders} 
        totalSupply={totalSupply}
      />

      {error && (
        <div className={cn(
          "fixed inset-0 z-[150]",
          "flex items-center justify-center",
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
      )}

      {isLoading && (
        <div className={cn(
          "fixed inset-0 z-[150]",
          "flex items-center justify-center",
          "bg-black/90 backdrop-blur-md"
        )}>
          <div className={cn(
            "animate-pulse text-red-400 font-['VT323'] text-2xl",
            "flex flex-col items-center gap-4"
          )}>
            Scanning the void...
            <div className={cn(
              "w-64 h-1 bg-red-900/30 rounded-full overflow-hidden",
              "border border-red-600/30",
              "shadow-[0_0_15px_rgba(220,38,38,0.15)]"
            )}>
              <div className={cn(
                "h-full bg-gradient-to-r from-red-600/50 to-red-500/70",
                "animate-progress"
              )} />
            </div>
          </div>
        </div>
      )}

      <div className={cn(
        "fixed inset-0 z-40",
        "bg-black/90",
        "overflow-y-auto"
      )}>
        {[5, 4, 3, 2, 1].map((tier) => (
          <TierSection
            key={tier}
            tier={tier}
            holders={holders.filter(h => h.rank === tier)}
            totalSupply={totalSupply}
            backgroundImage={TIER_IMAGES[tier as keyof typeof TIER_IMAGES]}
            icons={TIER_ICONS[tier as keyof typeof TIER_ICONS]}
          />
        ))}
      </div>
    </div>
  );
};