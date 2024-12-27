import { type FC, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useEntity } from '@/hooks/use-entity';
import { EntityTypingText } from './EntityTypingText';
import { EntityChatDialog } from './EntityChatDialog';
import { fadeAnimation } from '@/lib/animations';

interface EntityDisplayProps {
  entityId: string;
}

export const EntityDisplay: FC<EntityDisplayProps> = ({ entityId }) => {
  const { entity, isLoading } = useEntity(entityId);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const spiritNumber = useMemo(() => Math.floor(Math.random() * 9000) + 1000, []);

  useEffect(() => {
    if (!entity || isLoading) return;
    setShowChat(true);
  }, [entity, isLoading]);

  const handleOpenChange = useCallback((open: boolean) => {
    setShowChat(open);
    if (!open) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  return (
    <AnimatePresence mode="wait">
      {entity && (
        <EntityChatDialog
          key="chat"
          open={showChat}
          onOpenChange={handleOpenChange}
          entityName={entity.name}
          entityId={entityId}
          spiritNumber={spiritNumber}
        />
      )}
    </AnimatePresence>
  );
};