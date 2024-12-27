import { useState, useEffect } from 'react';

interface KeypadSequenceProps {
  onComplete: () => void;
}

export const KeypadSequence = ({ onComplete }: KeypadSequenceProps) => {
  const [currentText, setCurrentText] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [enteredCode, setEnteredCode] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<'typing' | 'keypad' | 'complete'>('typing');

  const messages = [
    "Go on, escape if you can, simply solve the code.",
    "Heh... or so I'd have you believe."
  ];

  useEffect(() => {
    if (isTyping && currentPhase === 'typing') {
      const message = messages[currentMessageIndex];
      if (currentText.length < message.length) {
        const timeout = setTimeout(() => {
          setCurrentText(message.slice(0, currentText.length + 1));
        }, 30);
        return () => clearTimeout(timeout);
      } else if (currentMessageIndex < messages.length - 1) {
        const timeout = setTimeout(() => {
          setCurrentText('');
          setCurrentMessageIndex(prev => prev + 1);
        }, 1000);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentPhase('keypad');
          setShowKeypad(true);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentText, currentMessageIndex, isTyping, currentPhase]);

  useEffect(() => {
    if (currentPhase === 'keypad' && showKeypad) {
      if (enteredCode.length < 3) {
        const timeout = setTimeout(() => {
          setEnteredCode(prev => prev + '6');
        }, 500);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setShowKeypad(false);
          setCurrentPhase('complete');
          onComplete();
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentPhase, showKeypad, enteredCode, onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {currentPhase === 'typing' && (
        <p className="text-white text-6xl font-['VT323'] transition-opacity duration-300 min-h-[2em] text-center">
          {currentText}
        </p>
      )}
      
      {currentPhase === 'keypad' && showKeypad && (
        <div className="bg-black/80 p-8 rounded-lg border-2 border-white/80">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((num) => (
              <div
                key={num}
                className="w-16 h-16 bg-black border-2 border-white/80 flex items-center justify-center text-white text-2xl font-['VT323']"
              >
                {num}
              </div>
            ))}
          </div>
          <div className="text-center text-white text-3xl font-['VT323'] mt-4">
            {enteredCode.padEnd(3, '_')}
          </div>
        </div>
      )}
    </div>
  );
};