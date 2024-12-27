import { type FC, useRef, useEffect, useState } from 'react';
import { useChat } from './hooks/useChat';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { useSpiritNumber } from '@/hooks/use-spirit-number';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChatInterfaceProps {
  onClose: () => void;
}

export const ChatInterface: FC<ChatInterfaceProps> = ({ onClose }) => {
  const { messages, sendMessage, isLoading } = useChat();
  const spiritNumber = useSpiritNumber();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = () => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (messageContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = messageContainerRef.current;
      const bottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 20;
      setAutoScroll(bottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    messageContainerRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      messageContainerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className={cn(
        "sticky top-0 z-10 flex items-center justify-between px-4 py-3",
        "border-b border-violet-500/30",
        "bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-blue-900/90",
        "backdrop-blur-sm"
      )}>
        <div className="flex items-center gap-3">
          <motion.img 
            src="https://imgur.com/nehd2hj.jpg"
            alt="Iris" 
            className={cn(
              "w-10 h-10 rounded-full object-cover",
              "border-2 border-violet-400/50",
              "shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            )}
            animate={{ 
              boxShadow: [
                '0 0 15px rgba(139,92,246,0.2)',
                '0 0 25px rgba(139,92,246,0.4)',
                '0 0 15px rgba(139,92,246,0.2)'
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <div className="flex flex-col">
            <span className={cn(
              "text-2xl font-['VT323'] tracking-wider",
              "bg-gradient-to-r from-pink-400 to-violet-400",
              "bg-gradient-to-r from-pink-400 to-violet-400",
              "bg-clip-text text-transparent"
            )}>
              Amara
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-violet-200 hover:text-violet-100 transition-colors font-['VT323'] text-3xl"
        >
          ×
        </button>
      </div>
      <div 
        className={cn(
          "flex-1 overflow-y-auto p-4 space-y-4 min-h-0",
          "scrollbar-custom overflow-x-hidden min-h-0",
          "bg-gradient-to-b from-black/60 via-violet-900/10 to-black/60",
          "shadow-[inset_0_0_30px_rgba(139,92,246,0.1)]"
        )}
        ref={messageContainerRef}
        style={{ height: 'calc(100% - 8rem)' }}
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={cn(
        "flex-shrink-0 sticky bottom-0 z-10",
        "bg-gradient-to-r from-violet-900/90 via-fuchsia-900/40 to-indigo-900/90 backdrop-blur-sm",
      )}>
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};