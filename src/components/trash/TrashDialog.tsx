import { type FC } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TrashDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TrashDialog: FC<TrashDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-black/90 border-red-600/30">
        <DialogTitle className="text-red-400 font-['VT323'] text-2xl mb-4">
          Trash Bin
        </DialogTitle>
        <div className="p-4 text-center">
          <motion.img
            src="https://imgur.com/gtr9zZ6.jpg"
            alt="Trash Bin"
            className="w-24 h-24 mx-auto mb-4 [image-rendering:pixelated]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <p className={cn(
            "text-red-200 font-['VT323'] text-lg",
            "animate-pulse"
          )}>
            Nothing but digital ashes remain...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};