import { type FC } from 'react';
import { cn } from '@/lib/utils';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={cn(
        "max-w-[80%] px-4 py-2 rounded",
        "border backdrop-blur-sm shadow-lg",
        isUser ? [
          "bg-red-950/40 border-red-600/30 animate-fade-in",
          "text-red-100 font-['VT323'] text-lg"
        ] : [
          "bg-black/40 border-red-800/30 animate-pulse-slow",
          "text-red-200 font-['VT323'] text-lg"
        ]
      )}>
        <p className="whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
};