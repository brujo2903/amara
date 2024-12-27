import { type FC } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface KeypadButtonProps {
  num: number | string;
  isActive: boolean;
}

export const KeypadButton: FC<KeypadButtonProps> = ({ num, isActive }) => {
  return (
    <motion.div
      animate={isActive ? {
        scale: [1, 1.2, 1],
        borderColor: [
          'rgba(220,38,38,0.4)', 
          'rgba(239,68,68,0.9)', 
          'rgba(220,38,38,0.4)'
        ],
        boxShadow: [
          '0 0 25px rgba(220,38,38,0.3)',
          '0 0 45px rgba(239,68,68,0.7)',
          '0 0 25px rgba(220,38,38,0.3)'
        ]
      } : {}}
      transition={{ 
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={cn(
        "w-16 h-16 bg-black/70 border-2",
        "border-red-600/40 flex items-center justify-center",
        "text-red-200 text-2xl font-['VT323']",
        "transition-all duration-200",
        "hover:bg-red-950/50 hover:border-red-500/60",
        "hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]",
        "shadow-[0_0_20px_rgba(220,38,38,0.2)]",
        isActive && "z-10"
      )}
    >
      {num}
    </motion.div>
  );
};