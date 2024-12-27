import { motion } from 'framer-motion';
import { useSequenceContext } from './SequenceProvider';

interface AvatarTransitionProps {
  onComplete: () => void;
}

export const AvatarTransition = ({ onComplete }: AvatarTransitionProps) => {
  const { timing } = useSequenceContext();

  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: timing.fadeTime / 1000 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: timing.avatarTransition / 1000,
          ease: [0.16, 1, 0.3, 1],
          delay: 1
        }}
        onAnimationComplete={onComplete}
        className="flex flex-col items-center gap-8"
      >
        <motion.img 
          src="https://imgur.com/iV48eLp.jpg"
          alt="Morvak"
          className="w-48 h-48 rounded-full object-cover border-4 border-red-600/50"
          animate={{ 
            boxShadow: ['0 0 20px rgba(220,38,38,0.3)', '0 0 40px rgba(220,38,38,0.5)'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
    </motion.div>
  );
};