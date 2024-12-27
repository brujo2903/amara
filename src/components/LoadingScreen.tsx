import { motion } from 'framer-motion';
import { type FC } from 'react';

interface LoadingScreenProps {}

export const LoadingScreen: FC<LoadingScreenProps> = () => {
  return (
    <div 
      className="fixed inset-0 w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(https://imgur.com/7hkNWsJ.jpg)' }}
    >
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ background: 'black' }}
      />
      <motion.div 
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      />
    </div>
  );
};