import { type FC, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ComingSoonOverlay } from '@/components/web/ComingSoonOverlay';
import { ChamberDialog } from '@/components/chamber/ChamberDialog';
import { EntityDialog } from '@/components/entity/EntityDialog';
import { WebAppDialog } from '@/components/web/WebAppDialog';

interface NavigationIconsProps {
  show: boolean;
}

export const NavigationIcons: FC<NavigationIconsProps> = ({ show }) => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showChamberDialog, setShowChamberDialog] = useState(false);
  const [showEntityDialog, setShowEntityDialog] = useState(false);
  const [showWebAppDialog, setShowWebAppDialog] = useState(false);
  const navigate = useNavigate();

  const handleChamberSelect = useCallback((type: 'web' | 'entity') => {
    setShowChamberDialog(false);
    if (type === 'entity') {
      setShowEntityDialog(true);
    } else {
      setShowWebAppDialog(true);
    }
  }, []);

  return (
    <>
      <ComingSoonOverlay 
        show={showComingSoon} 
        onComplete={() => setShowComingSoon(false)} 
      />
      <ChamberDialog
        open={showChamberDialog}
        onOpenChange={setShowChamberDialog}
        onSelect={handleChamberSelect}
      />
      <EntityDialog
        open={showEntityDialog}
        onOpenChange={setShowEntityDialog}
      />
      <WebAppDialog
        open={showWebAppDialog}
        onOpenChange={setShowWebAppDialog}
      />
      <div className={cn(
        "fixed bottom-8 left-8 flex gap-6 z-50 pointer-events-auto",
        "animate-fade-in"
      )}>
        <button 
          onClick={() => setShowChamberDialog(true)}
          className={cn(
            "relative group hover:scale-110 active:scale-95",
            "focus:outline-none",
            "transition-all duration-200",
            "cursor-pointer"
          )}
        >
          <img 
            src="https://imgur.com/kVpdlGk.jpg" 
            alt="Carnival" 
            className={cn(
              "w-40 h-40 object-contain [image-rendering:pixelated]",
              "filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]",
              "group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]",
              "transition-all duration-200"
            )}
          />
          <span className={cn(
            "absolute -top-8 left-1/2 -translate-x-1/2",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "text-white font-['VT323'] text-xl",
            "[image-rendering:pixelated]",
            "whitespace-nowrap",
            "bg-white/10 backdrop-blur-sm px-4 py-1 rounded",
            "shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          )}>
            Carnival
          </span>
        </button>
        <button 
          onClick={() => setShowComingSoon(true)}
          className={cn(
            "relative group hover:scale-110 active:scale-95",
            "focus:outline-none",
            "transition-all duration-200",
            "cursor-pointer"
          )}
        >
          <img 
            src="https://imgur.com/fXc5pAz.jpg" 
            alt="Fantasy" 
            className={cn(
              "w-40 h-40 object-contain [image-rendering:pixelated]",
              "filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]",
              "group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]",
              "transition-all duration-200"
            )}
          />
          <span className={cn(
            "absolute -top-8 left-1/2 -translate-x-1/2",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "text-white font-['VT323'] text-xl whitespace-nowrap",
            "[image-rendering:pixelated]",
            "bg-white/10 backdrop-blur-sm px-4 py-1 rounded",
            "shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          )}>
            Fantasy
          </span>
        </button>
      </div>
    </>
  );
};