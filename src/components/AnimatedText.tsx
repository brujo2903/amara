import { useState, useEffect } from 'react';
import { NavigationIcons } from './NavigationIcons';
import { DesktopIcons } from './DesktopIcons';
import { KeypadSequence } from './sequence/KeypadSequence';
import { SequenceProvider } from './sequence/SequenceProvider';

interface AnimatedTextProps {
  initialPhase?: 'initial' | 'morvak' | 'keypad' | 'final';
  onSequenceComplete?: () => void;
}

const initialMessages = [
  "oh hey, seems like you made it.",
  "haha, now you're stuck and can never go back.",
  "welcome in for an a eternity."
];

export const AnimatedText = ({ initialPhase = 'initial', onSequenceComplete }: AnimatedTextProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<'initial' | 'morvak' | 'keypad' | 'final'>(initialPhase);
  const [showNewBackground, setShowNewBackground] = useState(initialPhase === 'final');

  useEffect(() => {
    if (phase === 'final') {
      setShowNewBackground(true);
      onSequenceComplete?.();
    }
  }, [phase, onSequenceComplete]);

  useEffect(() => {
    if (phase === 'initial') {
      const startDelay = setTimeout(() => {
        setIsTyping(true);
      }, 200);
      return () => clearTimeout(startDelay);
    }
  }, [phase]);

  useEffect(() => {
    if (isTyping && currentText.length < initialMessages[currentMessageIndex].length) {
      const typingDelay = setTimeout(() => {
        setCurrentText(initialMessages[currentMessageIndex].slice(0, currentText.length + 1));
      }, 30);
      return () => clearTimeout(typingDelay);
    } else if (isTyping) {
      const visibilityDelay = setTimeout(() => {
        setIsTyping(false);
        setIsVisible(false);
      }, 500);
      return () => clearTimeout(visibilityDelay);
    }
  }, [currentText, isTyping, currentMessageIndex]);

  useEffect(() => {
    if (!isVisible && currentMessageIndex < initialMessages.length - 1) {
      const nextMessageDelay = setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1);
        setCurrentText('');
        setIsTyping(true);
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(nextMessageDelay);
    } else if (!isVisible && currentMessageIndex === initialMessages.length - 1) {
      const finalDelay = setTimeout(() => {
        setPhase('keypad');
      }, 500);
      return () => clearTimeout(finalDelay);
    }
  }, [isVisible, currentMessageIndex]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      {phase === 'initial' && (
        <p 
          className={`text-white text-6xl transition-opacity duration-1000 font-['VT323'] ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {currentText}
        </p>
      )}
      
      {phase === 'keypad' && (
        <SequenceProvider>
          <KeypadSequence onComplete={() => setPhase('final')} />
        </SequenceProvider>
      )}

      {phase === 'final' && (
        <div className="relative w-full h-full">
          <div className={`fixed inset-0 bg-[url('https://imgur.com/xN7qnt9.jpg')] bg-cover bg-center transition-opacity duration-500 ${showNewBackground ? 'opacity-100' : 'opacity-0'}`} />
          <NavigationIcons show={showNewBackground} />
          <DesktopIcons show={showNewBackground} />
        </div>
      )}
    </div>
  );
};