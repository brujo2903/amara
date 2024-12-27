import { type FC } from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  src: string;
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export const DesktopIcon: FC<DesktopIconProps> = ({ 
  src, 
  label, 
  onClick, 
  href,
  className 
}) => {
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
      className={cn(
        "group flex flex-col items-center gap-1 focus:outline-none w-28",
        className
      )}
    >
      <div className={cn(
        "w-16 h-16 rounded-lg p-2",
        "transition-all duration-200",
        "group-hover:scale-110",
        "group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
      )}>
        <img 
          src={src} 
          alt={label}
          className={cn(
            "w-full h-full object-contain [image-rendering:pixelated]",
            "filter brightness-90 group-hover:brightness-110",
            "transition-all duration-200"
          )}
        />
      </div>
      <span className="text-white font-['VT323'] text-lg text-center truncate w-full" title={label}>
        {label}
      </span>
    </button>
  );
};