import { type FC } from 'react';
import { cn } from '@/lib/utils';
import type { Message } from '@/hooks/use-webapp-chat';

interface WebAppChatMessageProps {
  message: Message;
  isLast: boolean;
}

export const WebAppChatMessage: FC<WebAppChatMessageProps> = ({ message, isLast }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex items-start gap-2",
      isUser ? "justify-end" : "justify-start",
      "w-full px-2"
    )}>
      <div className={cn(
        "max-w-[80%] px-4 py-2 rounded-lg",
        "border backdrop-blur-sm shadow-lg transition-all duration-300",
        isUser ? [
          "bg-violet-900/40 border-violet-500/30",
          "hover:bg-violet-800/40 hover:border-violet-400/40",
          "text-white font-['VT323'] text-lg"
        ] : [
          "bg-black/40 border-red-800/30",
          "hover:bg-violet-900/20 hover:border-violet-400/40",
          "text-violet-100 font-['VT323'] text-lg"
        ]
      )}>
        <p className="whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
};