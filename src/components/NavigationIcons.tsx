import { type FC, useState } from 'react';
import { ComingSoonText } from './ComingSoonText';
import { ChamberDialog } from './chamber/ChamberDialog';
import { EntityDialog } from './entity/EntityDialog';

interface NavigationIconsProps {
  show: boolean;
}

export const NavigationIcons: FC<NavigationIconsProps> = ({ show }) => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showChamberDialog, setShowChamberDialog] = useState(false);
  const [showEntityDialog, setShowEntityDialog] = useState(false);

  const handleChamberSelect = (type: 'web' | 'entity') => {
    setShowChamberDialog(false);
    if (type === 'entity') {
      setShowEntityDialog(true);
    } else {
      setShowComingSoon(true);
    }
  };

  const handleIconClick = () => {
    setShowComingSoon(true);
  };

  return (
    <>
      <ComingSoonText 
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
      <div className={`fixed bottom-8 left-8 flex gap-6 z-50 transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={() => setShowChamberDialog(true)}
          className="relative group hover:scale-105 active:scale-95 transition-transform duration-150 focus:outline-none"
        >
          <img 
            src="https://imgur.com/hVAKsx4.jpg" 
            alt="Chamber" 
            className="w-40 h-40 object-contain [image-rendering:pixelated]"
          />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
            bg-black/90 backdrop-blur-sm px-4 py-1 rounded border border-red-600/30 text-white font-['VT323'] text-xl">
            Chamber
          </span>
        </button>
        <button 
          onClick={handleIconClick}
          className="relative group hover:scale-105 active:scale-95 transition-transform duration-150 focus:outline-none"
        >
          <img 
            src="https://imgur.com/Yqr6k5O.jpg" 
            alt="Marketplace" 
            className="w-40 h-40 object-contain [image-rendering:pixelated]"
          />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
            bg-black/90 backdrop-blur-sm px-4 py-1 rounded border border-red-600/30 text-white font-['VT323'] text-xl">
            Marketplace
          </span>
        </button>
      </div>
    </>
  );
};