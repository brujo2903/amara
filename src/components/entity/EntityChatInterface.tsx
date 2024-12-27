import { type FC, useState, useEffect, useRef } from 'react';
import { useEntityChat } from '@/hooks/use-entity-chat';
import { useEntity } from '@/hooks/use-entity';
import { EntityChatMessage } from './components/EntityChatMessage';
import { EntityChatInput } from './components/EntityChatInput';
import { cn } from '@/lib/utils';

interface EntityChatInterfaceProps {
  entityName: string;
  entityId: string;
  onClose: () => void;
}

export const EntityChatInterface: FC<EntityChatInterfaceProps> = ({ 
  entityName,
  entityId,
  onClose 
}) => {
  const { messages, sendMessage, isLoading } = useEntityChat(entityId);
  const { entity } = useEntity(entityId);
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

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
        "flex-shrink-0",
        "flex items-center justify-between px-4 py-3",
        "border-b border-violet-500/30",
        "bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-blue-900/90",
        "sticky top-0 z-10"
      )}>
        <div className="flex items-center gap-3">
          <img 
            src={entity?.avatar || "https://imgur.com/nehd2hj.jpg"}
            alt={entityName}
            className={cn(
              "w-10 h-10 rounded-full object-cover [image-rendering:pixelated]",
              "border-2 border-violet-500/30",
              "shadow-[0_0_15px_rgba(139,92,246,0.3)]",
              "animate-pulse-slow"
            )}
          />
          <div className="flex flex-col">
            <span className={cn(
              "text-2xl font-['VT323'] tracking-wider",
              "bg-gradient-to-r from-pink-400 to-violet-400",
              "bg-clip-text text-transparent"
            )}>
              {entityName}
            </span>
            <span className="text-sm text-violet-300/70 font-['VT323']">
              {entity?.description}
            </span>
          </div>
        </div>
      </div>

      <div 
        ref={messageContainerRef}
        className={cn(
          "flex-1 overflow-y-auto p-4 space-y-4 min-h-0",
          "scrollbar-custom",
          "bg-gradient-to-b from-black/60 via-violet-900/10 to-black/60",
          "shadow-[inset_0_0_30px_rgba(139,92,246,0.1)]"
        )}
      > 
        {messages.map((message, index) => (
          <EntityChatMessage
            key={index}
            message={message}
            isLast={index === messages.length - 1}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <EntityChatInput 
        onSend={sendMessage} 
        isLoading={isLoading} 
      />
    </div>
  );
};