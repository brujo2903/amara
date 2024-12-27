import { type FC } from 'react';
import { motion } from 'framer-motion';
import { usePhantom } from '@/hooks/use-phantom';
import { cn } from '@/lib/utils';

export const ConnectWallet: FC = () => {
  const { isConnected, isLoading, connect, disconnect } = usePhantom();

  return (
    <motion.button
      onClick={isConnected ? disconnect : connect}
      disabled={isLoading}
      className={cn(
        "w-full px-4 py-3 rounded-lg",
        "bg-gradient-to-r from-red-950/60 via-red-900/40 to-red-950/60",
        "border border-red-600/30",
        "text-red-100 font-['VT323'] text-lg",
        "transition-all duration-200",
        "hover:bg-red-900/50 hover:border-red-500/60",
        "hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]",
        "active:scale-[0.98] active:shadow-[0_0_15px_rgba(220,38,38,0.3)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-red-600/50",
        isConnected && [
          "bg-red-900/40 border-red-500/50",
          "shadow-[0_0_20px_rgba(220,38,38,0.25)]"
        ]
      )}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <motion.div
            className={cn(
              "w-4 h-4 border-2 border-red-600/70 border-t-transparent rounded-full",
              "shadow-[0_0_10px_rgba(220,38,38,0.3)]"
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          {isConnected ? "Disconnecting..." : "Connecting..."}
        </span>
      ) : isConnected ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Wallet Connected
        </span>
      ) : (
        "Connect with Phantom"
      )}
    </motion.button>
  );
};