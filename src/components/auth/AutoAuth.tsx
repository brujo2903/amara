import { type FC } from 'react';
import { useAutoAuth } from '@/hooks/use-auto-auth';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const AutoAuth: FC = () => {
  const { isLoading, error, retry } = useAutoAuth();

  if (error && error !== 'No active session') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50",
          "p-4 bg-red-950/40 border border-red-600/30 rounded-lg",
          "text-red-400 font-['VT323'] text-lg",
          "flex items-center gap-4",
          "shadow-[0_0_20px_rgba(220,38,38,0.2)]"
        )}
      >
        <span>Failed to connect: {error}</span>
        <button
          onClick={retry}
          className={cn(
            "px-3 py-1 rounded",
            "bg-red-900/40 border border-red-600/30",
            "text-red-200 hover:text-red-100",
            "transition-colors duration-200",
            "hover:bg-red-800/40 hover:border-red-500/50",
            "focus:outline-none focus:ring-2 focus:ring-red-600/50"
          )}
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return null;
};