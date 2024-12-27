import { type FC } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TypingText } from './TypingText';
import { useSequenceContext } from '../context/SequenceContext';
import { MESSAGES } from '../config';

interface FinalSequenceProps {
  onComplete: () => void;
}

export const FinalSequence: FC<FinalSequenceProps> = ({ onComplete }) => {
  return (
    <AnimatePresence mode="wait">
      <TypingText
        text={MESSAGES.final}
        onComplete={onComplete}
        className="text-center max-w-2xl"
      />
    </AnimatePresence>
  );
};