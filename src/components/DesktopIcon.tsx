import { type FC } from 'react';

interface DesktopIconProps {
  src: string;
  label: string;
  onClick?: () => void;
  href?: string;
}

export const DesktopIcon: FC<DesktopIconProps> = ({ src, label, onClick, href }) => {
  const handleClick = () => {
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group flex flex-col items-center gap-1 focus:outline-none"
    >
      <div className="w-14 h-14 bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-white/10
        group-hover:bg-red-900/60 group-hover:border-white/20 transition-all duration-150"
      >
        <img 
          src={src} 
          alt={label}
          className="w-10 h-10 object-contain [image-rendering:pixelated]"
        />
      </div>
      <span className="text-white font-['VT323'] text-lg text-center">
        {label}
      </span>
    </button>
  );
};