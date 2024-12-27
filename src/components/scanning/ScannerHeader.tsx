import { type FC } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScannerHeaderProps {
  onSearchClick: () => void;
}

export const ScannerHeader: FC<ScannerHeaderProps> = ({ onSearchClick }) => {
  return (
    <div className={cn(
      "fixed top-4 left-1/2 -translate-x-1/2 z-[200]",
      "w-full max-w-2xl px-4"
    )}>
      <button
        onClick={onSearchClick}
        className={cn(
          "w-full flex items-center gap-3",
          "bg-black/60 border border-red-600/30 rounded-lg",
          "px-4 py-3 transition-all duration-200",
          "hover:bg-red-950/40 hover:border-red-500/50",
          "focus:outline-none focus:ring-2 focus:ring-red-600/50",
          "group"
        )}
      >
        <Search className={cn(
          "w-6 h-6 text-red-400/70",
          "group-hover:text-red-300/70",
          "transition-colors duration-200",
          "[image-rendering:pixelated]"
        )} />
        <span className={cn(
          "text-red-400/50 font-['VT323'] text-xl",
          "group-hover:text-red-300/50",
          "transition-colors duration-200"
        )}>
          Search for a token address...
        </span>
      </button>
    </div>
  );
};