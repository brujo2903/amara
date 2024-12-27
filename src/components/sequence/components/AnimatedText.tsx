import { type FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypingText } from './TypingText';
import { AvatarSequence } from './AvatarSequence';
import { KeypadSequence } from './KeypadSequence';
import type { SequenceStep } from '../types';
import { useSequenceContext } from '../context/SequenceContext';
import { MESSAGES } from '../config';

interface AnimatedTextProps {
  initialPhase?: SequenceStep;
  onSequenceComplete?: () => void;
}

export const AnimatedText: FC<AnimatedTextProps> = ({ 
  initialPhase = 'initial', 
  onSequenceComplete 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<'initial' | 'morvak' | 'keypad' | 'final'>(initialPhase);
  const [showNewBackground, setShowNewBackground] = useState(initialPhase === 'final');
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (phase === 'final' && !isCompleting) {
      setIsCompleting(true);
      setShowNewBackground(true);
      const timeout = setTimeout(() => {
        onSequenceComplete?.();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [phase, onSequenceComplete]);

  const { currentStep, currentMessageIndex, transition, timing } = useSequenceContext();

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 flex items-center justify-center z-10">
        {currentStep === 'avatar' && initialPhase !== 'final' && (
          <AvatarSequence onComplete={() => transition('escape')} />
        )}

        {currentStep === 'final' && initialPhase !== 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ 
              duration: timing.fadeTime / 3000,
              ease: "easeOut"
            }}
            onAnimationComplete={() => {
              onSequenceComplete?.();
            }}
          >
            <TypingText
              text={MESSAGES.final}
              onComplete={() => {}}
              className="text-center max-w-2xl"
            />
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};