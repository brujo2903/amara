import { type FC } from 'react';
import { DesktopIcons } from '@/components/desktop/DesktopIcons';
import { NavigationIcons } from '@/components/navigation/NavigationIcons';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MainContentProps {
  initialPhase?: 'initial' | 'morvak' | 'keypad' | 'final';
  onSequenceComplete?: () => void;
  skipAnimation?: boolean;
}

export const MainContent: FC<MainContentProps> = ({ 
  initialPhase = 'final',
  skipAnimation = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={cn(
        "fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-black",
        "transition-opacity duration-500 ease-in-out"
      )}
      style={{
        backgroundImage: 'url(https://imgur.com/QvBk6Du.jpg)'
      }}
    >
      <div className={cn(
        "absolute inset-0",
        "bg-black/20",
        "transition-all duration-500 ease-in-out"
      )} />
      <DesktopIcons show={true} />
      <NavigationIcons show={true} />
    </motion.div>
  );
};