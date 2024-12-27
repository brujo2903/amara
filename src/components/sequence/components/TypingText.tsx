import { type FC, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSequenceContext } from '../context/SequenceContext';
import { calculateTypingDelay } from '../utils/timing';
import { createCleanup } from '../utils/cleanup';
import { fadeAnimation } from '../animations/fadeAnimation';

interface TypingTextProps {
  text: string;
  onComplete: () => void;
  className?: string;
}

export const TypingText: FC<TypingTextProps> = ({ 
  text, 
  onComplete, 
  className = '' 
}) => {
  const { timing } = useSequenceContext();
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const startTyping = useCallback(() => {
    const { setTimeout, cleanup } = createCleanup();
    setIsTyping(true);
    
    const typeNextChar = (currentIndex: number) => {
      if (currentIndex < text.length) {
        const nextChar = text[currentIndex];
        const nextDelay = calculateTypingDelay(nextChar, timing.typingSpeed);

        setDisplayText(text.slice(0, currentIndex + 1));
        setTimeout(() => typeNextChar(currentIndex + 1), nextDelay);
      } else {
        setIsTyping(false);
        setIsComplete(true);
        setTimeout(onComplete, timing.completePause);
      }
    };

    setTimeout(() => typeNextChar(0), timing.shortPause);
    return cleanup;
  }, [text, timing, onComplete]);

  useEffect(() => {
    const cleanup = startTyping();
    return () => {
      cleanup();
      setDisplayText('');
      setIsComplete(false);
      setIsTyping(false);
    };
  }, [startTyping]);

  return (
    <motion.div
      variants={fadeAnimation}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: timing.fadeTime / 1000 }}
      className="relative z-20"
    >
      <motion.p 
        className={`text-white text-4xl md:text-5xl lg:text-6xl font-['VT323'] ${className}`}
        animate={{ 
          opacity: isComplete ? [1, 0.8, 1] : 1,
        }}
        transition={{ 
          duration: 1.5,
          repeat: isComplete ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        {displayText}
        {isTyping && (
          <span className="inline-block w-4 h-[0.1em] ml-1 bg-white animate-[pulse_0.6s_ease-in-out_infinite] opacity-80" />
        )}
      </motion.p>
    </motion.div>
  );
};