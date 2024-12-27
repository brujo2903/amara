import { type FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EntityTypingTextProps {
  text: string;
  onComplete: () => void;
  className?: string;
}

export const EntityTypingText: FC<EntityTypingTextProps> = ({ 
  text, 
  onComplete, 
  className = '' 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const timeouts: number[] = [];

    const startTyping = () => {
      setIsTyping(true);
      let currentIndex = 0;

      const typeNextChar = () => {
        if (!isMounted) return;

        if (currentIndex < text.length) {
          const nextChar = text[currentIndex];
          const delay = nextChar.match(/[,.?!]/) ? 90 : nextChar === ' ' ? 60 : 30;

          setDisplayText(text.slice(0, currentIndex + 1));
          const timeout = window.setTimeout(() => typeNextChar(), delay);
          timeouts.push(timeout);
          currentIndex++;
        } else {
          setIsTyping(false);
          setIsComplete(true);
          const timeout = window.setTimeout(() => {
            if (isMounted) {
              setIsDone(true);
              onComplete();
            }
          }, 400);
          timeouts.push(timeout);
        }
      };

      const timeout = window.setTimeout(() => typeNextChar(), 150);
      timeouts.push(timeout);
    };

    startTyping();

    return () => {
      isMounted = false;
      timeouts.forEach(clearTimeout);
      setDisplayText('');
      setIsComplete(false);
      setIsDone(false);
      setIsTyping(false);
    };
  }, [text, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.p 
        className={cn("text-white font-['VT323']", className)}
        animate={{ opacity: 1 }}
      >
        {displayText}
        {isTyping && (
          <span className="inline-block w-4 h-[0.1em] ml-1 bg-white animate-[pulse_0.6s_ease-in-out_infinite] opacity-80" />
        )}
      </motion.p>
    </motion.div>
  );
};