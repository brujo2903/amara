import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesktopIcon } from './DesktopIcon';
import { TrashDialog } from './TrashDialog';
import { ChatDialog } from './chat/ChatDialog';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface TypingTextProps {
  text: string;
  onComplete: () => void;
  timing: SequenceTiming;
  className?: string;
}

export const TypingText = ({ text, onComplete, timing, className = '' }: TypingTextProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutsRef = useRef<number[]>([]);

  const startTyping = useCallback(() => {
    let isMounted = true;
    setIsTyping(true);
    
    const typeNextChar = (currentIndex: number) => {
      if (!isMounted) return;
      
      if (currentIndex < text.length) {
        const nextChar = text[currentIndex];
        const nextDelay = nextChar.match(/[,.?!]/) 
          ? timing.typingSpeed * 3  // Longer pause for punctuation
          : nextChar === ' ' 
            ? timing.typingSpeed * 1.5  // Medium pause for spaces
            : timing.typingSpeed;

        setDisplayText(text.slice(0, currentIndex + 1));
        const timeout = window.setTimeout(() => typeNextChar(currentIndex + 1), nextDelay);
        timeoutsRef.current.push(timeout);
      } else {
        setIsTyping(false);
        setIsComplete(true);
        const timeout = window.setTimeout(onComplete, timing.completePause);
        timeoutsRef.current.push(timeout);
      }
    };

    const timeout = window.setTimeout(() => {
      if (isMounted) {
        typeNextChar(0);
      }
    }, timing.shortPause);
    timeoutsRef.current.push(timeout);

    return () => {
      isMounted = false;
    };
  }, [text, timing, onComplete]);

  useEffect(() => {
    const cleanupTyping = startTyping();
    return () => {
      cleanupTyping();
      timeoutsRef.current.forEach(window.clearTimeout);
      timeoutsRef.current = [];
      setDisplayText('');
      setIsComplete(false);
      setIsTyping(false);
    };
  }, [startTyping]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: timing.fadeTime / 1000 }}
      className="relative"
    >
      <motion.p 
        className={`text-white text-4xl md:text-5xl lg:text-6xl font-['VT323'] ${className}`}
        animate={{ 
          opacity: isComplete ? [1, 0.8, 1] : 1,
        }}
        transition={{ 
          duration: 2,
          repeat: isComplete ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        {displayText}
        {isTyping && (
          <span className="inline-block w-4 h-[0.1em] ml-1 bg-white animate-[pulse_0.8s_ease-in-out_infinite]" />
        )}
      </motion.p>
    </motion.div>
  );
};