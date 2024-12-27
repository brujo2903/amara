import { type FC } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog/DialogTitle';
import { EntityForm } from './EntityForm';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EntityDialog: FC<EntityDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[700px] h-[85vh] bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 border-0",
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "overflow-visible rounded-lg",
        "shadow-[0_0_40px_rgba(124,58,237,0.3)]",
        "backdrop-blur-md",
        "flex flex-col"
      )}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogTitle className={cn(
            "font-['VT323'] text-3xl text-center",
            "bg-clip-text text-transparent",
            "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
            "animate-text-shimmer",
            "border-b border-violet-500/30 p-4",
            "flex-shrink-0"
          )}>
            In my image, you wish to create?
          </DialogTitle>
        </motion.div>
        <div className="flex-1 overflow-hidden relative">
          <EntityForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};