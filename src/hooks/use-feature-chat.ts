import { useState } from 'react';
import { useChat } from '@/components/chat/hooks/useChat';

export function useFeatureChat() {
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const { messages, sendMessage, isLoading } = useChat();

  const showFeatureMessage = () => {
    setIsChatDialogOpen(true);
  };

  return {
    isChatDialogOpen,
    setIsChatDialogOpen,
    showFeatureMessage,
    messages,
    sendMessage,
    isLoading
  };
}