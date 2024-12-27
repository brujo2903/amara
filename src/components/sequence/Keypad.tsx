import { motion, AnimatePresence } from 'framer-motion';

interface KeypadProps {
  enteredCode: string;
  show: boolean;
}

export const Keypad = ({ enteredCode, show }: KeypadProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-black/80 p-8 rounded-lg border-2 border-white/80"
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((num) => (
              <div
                key={num}
                className="w-16 h-16 bg-black border-2 border-white/80 flex items-center justify-center text-white text-2xl font-['VT323']
                  transition-colors duration-200 hover:bg-white/10"
              >
                {num}
              </div>
            ))}
          </div>
          <div className="text-center text-white text-3xl font-['VT323'] mt-4">
            {enteredCode.padEnd(3, '_')}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};