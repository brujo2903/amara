import { type FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const COMING_SOON_TEXT = 'This feature will emerge soon... but time holds no meaning here, does it?';
const TYPING_SPEED = 100;
const DISPLAY_DURATION = 1000;
const FADE_DURATION = 500;

interface ComingSoonOverlayProps {
  show: boolean;
  onComplete?: () => void;
}

export const ComingSoonOverlay: FC<ComingSoonOverlayProps> = ({ 
  show, 
  onComplete 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!show) {
      setDisplayText('');
      setIsTyping(true);
      setIsVisible(true);
      setShowCursor(true);
      return;
    }

    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < COMING_SOON_TEXT.length) {
        const nextChar = COMING_SOON_TEXT[currentIndex];
        setDisplayText(prev => prev + nextChar);
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setShowCursor(false);
        
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 500); // Wait for fade out animation
        }, 800);
      }
    }, TYPING_SPEED);

    return () => {
      clearInterval(typeInterval);
    };
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <motion.div 
      className={cn(
        "fixed inset-0 z-[100]",
        "bg-black/80 backdrop-blur-sm",
        "flex items-center justify-center",
        `transition-opacity duration-${FADE_DURATION}`,
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <motion.p 
        className={cn(
          "text-white text-4xl font-['VT323']",
          "relative",
          showCursor && [
            "after:content-['']",
            "after:absolute",
            "after:right-[-0.5em]",
            "after:w-4",
            "after:h-[0.08em]",
            "after:bg-white",
            "after:animate-[pulse_0.8s_ease-in-out_infinite]"
          ]
        )}
      >
        {displayText}
      </motion.p>
    </motion.div>
  );
};