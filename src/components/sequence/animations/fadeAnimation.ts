import type { Variants } from 'framer-motion';

export const fadeAnimation: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};