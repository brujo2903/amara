import { type FC } from 'react';
import { useWebAppChat } from '@/hooks/use-webapp-chat';
import { cn } from '@/lib/utils';
import { WebAppChatMessage } from './WebAppChatMessage';
import { WebAppChatInput } from './WebAppChatInput';
import { useWebApp } from '@/hooks/use-webapp';
import { useSession } from '@/hooks/use-session';
import type { WebApp } from '@/types/webapp';

interface WebAppChatInterfaceProps {
  webApp: WebApp;
  onClose: () => void;
}

export const WebAppChatInterface: FC<WebAppChatInterfaceProps> = ({ 
  webApp,
  onClose 
}) => {
  const { messages, sendMessage, isLoading } = useWebAppChat(webApp.id);
  const { session } = useSession();
  const isOwner = session?.id === webApp.session_id;

  return (
    <div className="flex flex-col h-full">
      <div className={cn(
        "flex flex-col gap-2 px-4 py-3",
        "border-b border-violet-500/30",
        "bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-blue-900/90"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://imgur.com/q3Vefyn.jpg"
              alt="Ember"
              className={cn(
                "w-10 h-10 rounded-full object-cover [image-rendering:pixelated]",
                "border-2 border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]",
                !isOwner && "opacity-70"
              )}
            />
            <div className="flex flex-col">
              <span className={cn(
                "text-2xl text-red-200 font-['VT323'] tracking-wider",
                "bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent"
              )}>
              Amara
              </span>
              <span className="text-sm text-violet-300/70 font-['VT323']">
                Your creative companion
              </span>
            </div>
          </div>
        </div>
      </div>

      <div 
        className={cn(
          "flex-1 overflow-y-auto p-4 space-y-4 min-h-0",
          "scrollbar-custom",
          "bg-gradient-to-b from-black/60 via-violet-900/10 to-black/60",
          "shadow-[inset_0_0_30px_rgba(139,92,246,0.1)]",
          !isOwner && "opacity-70 pointer-events-none"
        )}
      > 
        {messages.map((message, index) => (
          <WebAppChatMessage
            key={index}
            message={message}
            isLast={index === messages.length - 1}
          />
        ))}
      </div>

      {isOwner ? (
        <WebAppChatInput onSend={sendMessage} isLoading={isLoading} />
      ) : (
        <div className={cn(
          "p-4 border-t border-violet-500/30",
          "bg-black/40 backdrop-blur-sm",
          "text-center text-violet-300/70 font-['VT323'] text-lg"
        )}>
          Another creator's vision... Let's admire their imagination.
        </div>
      )}
    </div>
  );
};