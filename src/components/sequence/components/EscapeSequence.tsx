import { type FC } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TypingText } from './TypingText';
import { useSequenceContext } from '../context/SequenceContext';
import { MESSAGES } from '../config';

interface EscapeSequenceProps {
  onComplete: () => void;
}

export const EscapeSequence: FC<EscapeSequenceProps> = ({ onComplete }) => {
  const { currentMessageIndex, transition } = useSequenceContext();

  return (
    <AnimatePresence mode="wait">
      {currentMessageIndex < MESSAGES.escape.length && (
        <TypingText
          key={`escape-${currentMessageIndex}`}
          text={MESSAGES.escape[currentMessageIndex]}
          onComplete={() => {
            if (currentMessageIndex === MESSAGES.escape.length - 1) {
              onComplete();
            } else {
              transition('next');
            }
          }}
          className="text-center max-w-2xl"
        />
      )}
    </AnimatePresence>
  );
};