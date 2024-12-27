import { type FC } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog/DialogTitle';
import { EntityForm } from './EntityForm';

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
      <DialogContent className="sm:max-w-[425px] bg-black/90 border-red-600/30">
        <DialogTitle className="text-red-400 font-['VT323'] text-2xl mb-4">
          Create New Entity
        </DialogTitle>
        <EntityForm />
      </DialogContent>
    </Dialog>
  );
};