import { type FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSequenceContext } from '../context/SequenceContext';
import { useNavigate } from 'react-router-dom';
import { MESSAGES } from '../config';
import { useKeypadTransition } from '../hooks/useKeypadTransition';
import { KeypadButton } from './KeypadButton';
import { cn } from '@/lib/utils';

const FORBIDDEN_SEQUENCE = ['6', '6', '6'];

interface KeypadProps {
  onComplete: () => void;
}

export const KeypadSequence: FC<KeypadProps> = ({ onComplete }) => {
  const { timing, currentMessageIndex, transition } = useSequenceContext();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [enteredCode, setEnteredCode] = useState('');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const { createTransitionOverlay, executeTransition } = useKeypadTransition();

  useEffect(() => {
    if (isCompleting) return;

    const timeout = setTimeout(() => {
      if (enteredCode.length < FORBIDDEN_SEQUENCE.length) {
        const nextDigit = FORBIDDEN_SEQUENCE[enteredCode.length];
        setActiveKey(nextDigit);
        
        setTimeout(() => {
          setActiveKey(null);
          setEnteredCode(prev => prev + nextDigit);
        }, 300);
      }
    }, timing.digitEntry);

    return () => {
      clearTimeout(timeout);
    };
  }, [enteredCode.length, timing.digitEntry, isCompleting]);

  useEffect(() => {
    if (enteredCode.length === FORBIDDEN_SEQUENCE.length && !isCompleting) {
      setIsCompleting(true);
      
      // Start fade out sequence
      setTimeout(() => {
        setIsVisible(false);
        const overlay = createTransitionOverlay();
        executeTransition(overlay, onComplete, navigate);
      }, timing.mediumPause);
    }
  }, [
    enteredCode.length,
    isCompleting,
    timing.mediumPause,
    onComplete,
    navigate,
    createTransitionOverlay,
    executeTransition
  ]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="keypad"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.1 }}
          exit={{ 
            opacity: 0,
            scale: 0.9,
            filter: "blur(8px)",
            y: 20
          }}
          transition={{ 
            type: "spring", 
            stiffness: 400,
            damping: 30,
            duration: 0.8
          }}
          className={cn(
            "bg-black/80 p-8 rounded-lg",
            "border-2 border-red-600/30",
            "shadow-[0_0_50px_rgba(220,38,38,0.3)]"
          )}
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((num) => (
              <KeypadButton
                key={num}
                num={num}
                isActive={activeKey === num.toString()}
              />
            ))}
          </div>
          <div className={cn(
            "text-center text-red-200 text-3xl font-['VT323'] mt-4",
            "animate-pulse"
          )}
          style={{ animationDuration: '0.8s' }}>
            {enteredCode.padEnd(3, '_')}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};