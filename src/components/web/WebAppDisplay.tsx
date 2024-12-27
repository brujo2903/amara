import { type FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useWebApp } from '@/hooks/use-webapp';
import { useSession } from '@/hooks/use-session';
import { WebAppChatDialog } from './WebAppChatDialog';
import { fadeAnimation } from '@/lib/animations';

interface WebAppDisplayProps {
  webAppId: string;
}

export const WebAppDisplay: FC<WebAppDisplayProps> = ({ webAppId }) => {
  const { webApp, isLoading, error } = useWebApp(webAppId);
  const { session, isLoading: sessionLoading } = useSession();
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate('/home', { replace: true });
    } else if (webApp && !isLoading) {
      setShowChat(true);
    }
  }, [webApp, isLoading, session, sessionLoading, navigate]);

  if (error || (!isLoading && !webApp)) {
    return (
      <motion.div
        {...fadeAnimation}
        className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
      >
        <p className="text-red-500 font-['VT323'] text-2xl">
          {error || 'Failed to manifest creation...'}
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {webApp && (
        <WebAppChatDialog
          key="chat"
          open={showChat}
          onOpenChange={(open) => {
            setShowChat(open);
            if (!open) {
              navigate('/home', { replace: true });
            }
          }}
          webApp={webApp}
        />
      )}
    </AnimatePresence>
  );
};