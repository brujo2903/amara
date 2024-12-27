import { type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog/DialogTitle';
import { cn } from '@/lib/utils';
import { slideUpAnimation } from '@/lib/animations';

interface ChamberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: 'web' | 'entity') => void;
}

export const ChamberDialog: FC<ChamberDialogProps> = ({
  open,
  onOpenChange,
  onSelect,
}) => {
  const session = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')!) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={() => onOpenChange(false)}
        className={cn(
          "sm:max-w-[425px] bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-blue-900/90 border-0",
          "backdrop-blur-md shadow-[0_0_40px_rgba(124,58,237,0.3)]",
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        )}
      >
        <DialogTitle asChild>
          <h2 className={cn(
            "font-['VT323'] text-3xl text-center mb-6",
            "bg-clip-text text-transparent",
            "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
            "animate-text-shimmer"
          )}>
            In my image, you wish to create?
          </h2>
        </DialogTitle>
        <motion.div {...slideUpAnimation} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <AnimatePresence mode="wait">
              <motion.button
                key="web-chamber"
                onClick={() => onSelect('web')}
                className={cn(
                  "p-6 rounded-lg border border-violet-500/30 bg-black/60",
                  "transition-all duration-200",
                  "hover:bg-violet-900/40 hover:border-violet-400/50",
                  "hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]",
                  "focus:outline-none focus:ring-2 focus:ring-violet-500/50",
                  "relative"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <img
                  src="https://imgur.com/Y2Xbn7n.jpg"
                  alt="Web App"
                  className={cn(
                    "w-20 h-20 mx-auto mb-3 [image-rendering:pixelated]",
                    "transition-all duration-200 group-hover:scale-110",
                    "filter group-hover:brightness-110",
                    "drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                  )}
                />
                <span className={cn(
                  "block font-['VT323'] text-xl",
                  "bg-gradient-to-r from-pink-400 to-violet-400",
                  "bg-clip-text text-transparent"
                )}>
                  Web App
                </span>
              </motion.button>
              <motion.button
                key="entity-chamber"
                onClick={() => onSelect('entity')}
                className={cn(
                  "p-6 rounded-lg border border-fuchsia-500/30 bg-black/60",
                  "hover:bg-fuchsia-900/40 hover:border-fuchsia-400/50",
                  "hover:shadow-[0_0_20px_rgba(192,38,211,0.3)]",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50",
                  "relative"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.1 }}
              >
                <img
                  src="https://imgur.com/OyNjMxa.jpg"
                  alt="Agent"
                  className={cn(
                    "w-20 h-20 mx-auto mb-3 [image-rendering:pixelated]",
                    "transition-all duration-200 group-hover:scale-110",
                    "filter group-hover:brightness-110",
                    "drop-shadow-[0_0_8px_rgba(192,38,211,0.4)]"
                  )}
                />
                <div className="space-y-1">
                  <span className={cn(
                    "block font-['VT323'] text-xl",
                    "bg-gradient-to-r from-fuchsia-400 to-pink-400",
                    "bg-clip-text text-transparent"
                  )}>
                    Agent
                  </span>
                </div>
              </motion.button>
            </AnimatePresence>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};