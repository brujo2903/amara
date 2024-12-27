import { type FC, useState, FormEvent } from 'react';
import { cn } from '@/lib/utils';

interface EntityChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const EntityChatInput: FC<EntityChatInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-red-600/30">
      <div className="flex gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          rows={1}
          className={cn(
            "flex-1 bg-black/60 border border-violet-500/30 rounded p-2",
            "text-white placeholder:text-violet-200/50 font-['VT323'] text-lg",
            "focus:outline-none focus:ring-1 focus:ring-violet-500/50",
            "focus:bg-violet-900/40 hover:bg-violet-900/20",
            "transition-all duration-200",
            "scrollbar-custom"
          )}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={cn(
            "px-4 py-2 bg-violet-900/40 border border-violet-500/30 rounded font-['VT323']",
            "text-white text-lg tracking-wide",
            "transition-colors duration-200",
            "hover:bg-violet-800/40 focus:outline-none focus:ring-1 focus:ring-violet-500/50",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          SEND
        </button>
      </div>
    </form>
  );
};