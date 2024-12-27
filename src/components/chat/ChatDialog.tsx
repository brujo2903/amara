import { type FC } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog';
import { ChatInterface } from './ChatInterface';
import { cn } from '@/lib/utils';

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatDialog: FC<ChatDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[425px] h-[600px] border-0",
        "bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95",
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "backdrop-blur-md shadow-[0_0_40px_rgba(124,58,237,0.3)]",
        "overflow-hidden rounded-lg"
      )}>
        <DialogTitle className={cn(
          "font-['VT323'] text-2xl",
          "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
          "bg-clip-text text-transparent",
          "border-b border-violet-500/30 p-4"
        )}>
          Chat with Ember
        </DialogTitle>
        <div className="flex-1 overflow-hidden h-[calc(100%-4rem)]">
          <ChatInterface onClose={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};