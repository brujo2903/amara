import { useState, useEffect } from 'react';

interface ComingSoonTextProps {
  show: boolean;
  onComplete: () => void;
}

export const ComingSoonText = ({ show, onComplete }: ComingSoonTextProps) => {
  const [text, setText] = useState('');
  const fullText = 'Coming Soon...';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setText('');
      setIsVisible(true);
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
              onComplete();
            }, 500);
          }, 800);
        }
      }, 100);

      return () => clearInterval(typeInterval);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-[100] bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <p className="text-white text-6xl font-['VT323']">{text}</p>
    </div>
  );
};