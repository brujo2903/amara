import { type FC, useState, FormEvent, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        handleSend();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className={cn(
            "flex-1 bg-black/60 border border-red-600/30 rounded p-2",
            "text-red-100 placeholder:text-red-200/50 font-['VT323'] text-lg",
            "resize-none max-h-32 min-h-[2.5rem]",
            "focus:outline-none focus:ring-1 focus:ring-red-600/50",
            "focus:bg-red-950/40 hover:bg-red-950/20",
            "transition-all duration-200",
            "scrollbar-custom"
          )}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={cn(
            "px-4 py-2 bg-red-900/40 border border-red-600/30 rounded font-['VT323']",
            "text-red-100 text-lg tracking-wide",
            "transition-colors duration-200",
            "hover:bg-red-800/40 focus:outline-none focus:ring-1 focus:ring-red-600/50",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          SEND
        </button>
      </div>
    </form>
  );
};