import { type FC } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TypingText } from './TypingText';
import { useSequenceContext } from '../context/SequenceContext';
import { MESSAGES } from '../config';

interface InitialSequenceProps {
  onComplete: () => void;
}

export const InitialSequence: FC<InitialSequenceProps> = ({ onComplete }) => {
  const { currentMessageIndex, transition } = useSequenceContext();

  return (
    <AnimatePresence mode="wait">
      {currentMessageIndex < MESSAGES.initial.length && (
        <TypingText
          key={`initial-${currentMessageIndex}`}
          text={MESSAGES.initial[currentMessageIndex]}
          onComplete={() => {
            if (currentMessageIndex === MESSAGES.initial.length - 1) {
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