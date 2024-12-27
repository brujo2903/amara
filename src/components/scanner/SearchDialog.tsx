import { type FC, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (address: string) => void;
}

export const SearchDialog: FC<SearchDialogProps> = ({ open, onOpenChange, onSearch }) => {
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onSearch(address.trim());
      onOpenChange(false);
      setAddress('');
    } finally {
      setIsSubmitting(false);
    }
  }, [address, isSubmitting, onSearch, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[500px] bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 border-0",
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "backdrop-blur-md shadow-[0_0_40px_rgba(124,58,237,0.3)]"
      )}>
        <DialogTitle className="sr-only">
          Search Contract Address
        </DialogTitle>
        <form onSubmit={handleSubmit} className="relative">
          <div className={cn(
            "flex items-center gap-3",
            "bg-black/60 border border-violet-500/30 rounded-lg",
            "px-4 py-3 transition-all duration-200",
            "focus-within:border-violet-400/50",
            "focus-within:shadow-[0_0_20px_rgba(139,92,246,0.3)]",
            "group"
          )}>
            <Search className={cn(
              "w-6 h-6 text-violet-400/70",
              "group-focus-within:text-violet-300/70",
              "transition-colors duration-200",
              "[image-rendering:pixelated]"
            )} />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              pattern="[1-9A-HJ-NP-Za-km-z]{32,44}"
              title="Enter a valid Solana token address"
              placeholder="Unveil the project's hidden data"
              className={cn(
                "flex-1 bg-transparent border-0",
                "text-violet-200 placeholder:text-violet-400/50",
                "font-['VT323'] text-xl",
                "focus:outline-none focus:ring-0"
              )}
              autoFocus
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!address.trim() || isSubmitting}
              className={cn(
                "px-4 py-2 rounded-lg",
                "bg-violet-900/40 border border-violet-500/30",
                "text-violet-200 font-['VT323'] text-lg",
                "transition-all duration-200",
                "hover:bg-violet-800/40 hover:border-violet-400/50",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              )}
            >
              {isSubmitting ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};