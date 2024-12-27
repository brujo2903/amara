import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TypingText } from './TypingText';
import { Keypad } from './Keypad';
import { AvatarTransition } from './AvatarTransition';
import { useSequenceContext } from './SequenceProvider';
import type { SequenceStep } from '@/hooks/use-sequence';
import { MESSAGES } from './constants';

interface KeypadSequenceProps {
  onComplete: () => void;
}

export const KeypadSequence = ({ onComplete }: KeypadSequenceProps) => {
  const [showKeypad, setShowKeypad] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const { currentStep, transition, timing } = useSequenceContext();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStepComplete = useCallback((nextStep: SequenceStep) => {
    setIsTransitioning(true);
    const timer = window.setTimeout(() => {
      setIsTransitioning(false);
      transition(nextStep);
    }, timing.mediumPause);
    
    return () => window.clearTimeout(timer);
  }, [timing.mediumPause, transition]);

  useEffect(() => {
    const timers: number[] = [];
    let isMounted = true;

    const sequence = async () => {
      if (!isMounted) return;

      if (currentStep === 'keypad' && !showKeypad && !isTransitioning) {
        const timer = window.setTimeout(() => setShowKeypad(true), timing.keypadDelay);
        timers.push(timer);
      }

      if (showKeypad && enteredCode.length < 3 && !isTransitioning) {
        const timer = window.setTimeout(() => {
          setEnteredCode(prev => prev + '6');
        }, timing.digitEntry);
        timers.push(timer);
      }

      if (enteredCode.length === 3 && !isTransitioning) {
        const timer = window.setTimeout(() => {
          setShowKeypad(false);
          handleStepComplete('final');
        }, timing.mediumPause);
        timers.push(timer);
      }
    };

    sequence();
    return () => {
      isMounted = false;
      timers.forEach(timer => window.clearTimeout(timer));
    };
  }, [currentStep, showKeypad, enteredCode.length, handleStepComplete, timing, isTransitioning]);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {currentStep === 'initial' && (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: timing.fadeTime / 1000 }}
          >
            <TypingText 
              text={MESSAGES.initial}
              onComplete={() => handleStepComplete('taunt')}
              timing={timing}
              className="text-center max-w-2xl"
            />
          </motion.div>
        )}
        
        {currentStep === 'taunt' && (
          <motion.div
            key="taunt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: timing.fadeTime / 1000 }}
          >
            <TypingText 
              text={MESSAGES.taunt}
              onComplete={() => handleStepComplete('keypad')}
              timing={timing}
              className="text-center max-w-2xl"
            />
          </motion.div>
        )}
        
        {currentStep === 'keypad' && (
          <motion.div
            key="keypad"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: timing.fadeTime / 1000 }}
          >
            <Keypad 
              show={showKeypad}
              enteredCode={enteredCode}
            />
          </motion.div>
        )}
        
        {currentStep === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: timing.fadeTime / 1000 }}
          >
            <TypingText 
              text={MESSAGES.final}
              onComplete={() => handleStepComplete('avatar')}
              timing={timing}
              className="text-center max-w-2xl"
            />
          </motion.div>
        )}
        
        {currentStep === 'avatar' && (
          <motion.div
            key="avatar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: timing.fadeTime / 1000 }}
          >
            <div className="flex flex-col items-center gap-8">
              <AvatarTransition 
                onComplete={() => {
                  const timer = window.setTimeout(() => {
                    handleStepComplete('complete');
                  }, timing.mediumPause);
                  return () => window.clearTimeout(timer);
                }}
              />
              <TypingText 
                text={MESSAGES.morvak}
                onComplete={() => {
                  const timer = window.setTimeout(onComplete, timing.finalPause);
                  return () => window.clearTimeout(timer);
                }}
                timing={timing}
                className="text-red-500 tracking-[0.2em] text-6xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};