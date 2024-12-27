import { type FC } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog/DialogTitle';
import { EntityChatInterface } from './EntityChatInterface';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { slideUpAnimation } from '@/lib/animations';

interface EntityChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityName: string;
  entityId: string;
  spiritNumber: number;
}

export const EntityChatDialog: FC<EntityChatDialogProps> = ({
  open,
  onOpenChange,
  entityName,
  entityId,
  spiritNumber,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[500px] h-[600px] z-50 border-0 fixed",
        "bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95",
        "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "backdrop-blur-md shadow-[0_0_40px_rgba(124,58,237,0.3)]",
        "overflow-hidden rounded-lg p-0",
        "flex flex-col"
      )}>
        <DialogTitle className="sr-only">
          Chat with {entityName} - Spirit #{spiritNumber}
        </DialogTitle>
        <motion.div
          {...slideUpAnimation}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <EntityChatInterface 
            entityName={entityName}
            entityId={entityId}
            onClose={() => onOpenChange(false)}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};