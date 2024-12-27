import { type FC } from 'react';
import { cn } from '@/lib/utils';

export const ProjectHeader: FC = () => {
  return (
    <div className={cn(
      "fixed top-4 left-4 z-[100]",
      "flex items-center gap-4",
      "bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-blue-900/80 backdrop-blur-sm",
      "px-4 py-2 rounded-lg border border-violet-500/30",
      "shadow-[0_0_30px_rgba(139,92,246,0.3)]",
      "animate-fade-in"
    )}>
      <h1 className={cn(
        "text-white font-['VT323'] text-2xl font-bold",
        "tracking-wider",
        "bg-gradient-to-r from-pink-400 via-purple-400 to-violet-400",
        "bg-clip-text text-transparent",
        "[image-rendering:pixelated]"
      )}>
        Amara Scanner
      </h1>
      
      <div className="flex items-center gap-3">
        <a
          href="https://x.com/amarascc"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            "hover:bg-violet-900/20 group"
          )}
        >
          <img
            src="https://imgur.com/XFaqdt9.jpg"
            alt="Twitter"
            className={cn(
              "w-5 h-5 [image-rendering:pixelated]",
              "filter brightness-0 invert",
              "group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]",
              "transition-all duration-200"
            )}
          />
        </a>
      </div>
    </div>
  );
};