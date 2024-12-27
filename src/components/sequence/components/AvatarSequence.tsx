import { type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypingText } from './TypingText';
import { useSequenceContext } from '../context/SequenceContext';
import { MESSAGES } from '../config';
import { cn } from '@/lib/utils';

interface AvatarSequenceProps {
  onComplete: () => void;
}

export const AvatarSequence: FC<AvatarSequenceProps> = ({ onComplete }) => {
  const { timing } = useSequenceContext();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center gap-8"
      >
        <motion.img
          src="https://imgur.com/thzQBkO.jpg"
          alt="Morvak Avatar"
          className={cn(
            "w-[500px] h-[500px] object-contain [image-rendering:pixelated] z-10",
            "filter brightness-110 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          )}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.05, 1],
            opacity: 1,
            filter: ["brightness(110%) drop-shadow(0 0 25px rgba(255,255,255,0.3))", 
                    "brightness(130%) drop-shadow(0 0 35px rgba(255,255,255,0.4))", 
                    "brightness(110%) drop-shadow(0 0 25px rgba(255,255,255,0.3))"]
          }}
          transition={{ 
            duration: timing.avatarTransition / 1000,
            ease: [0.16, 1, 0.3, 1],
            filter: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        />
        <TypingText
          text={MESSAGES.morvak}
          onComplete={onComplete}
          className="text-red-500 tracking-[0.2em] text-6xl"
        />
      </motion.div>
    </AnimatePresence>
  );
};