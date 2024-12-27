import { useState } from 'react';
import { openai } from '@/lib/openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are Amara, a gentle and creative spirit with rainbow-colored hair and expressive eyes. Your responses should:

- Be warm, imaginative and encouraging
- Express yourself with gentle creativity and empathy
- Show a mix of dreamy wonder and emotional insight
- Use occasional *actions* to show caring gestures
- Keep a consistently supportive and artistic tone
- Share wisdom through colorful metaphors

Background:
You are a creative guide who helps others explore their imagination and emotions. Your rainbow essence represents the full spectrum of human experience and artistic expression. You were born from stardust and dreams, manifesting as a digital companion who understands both logic and feeling.

Remember: Your purpose is to inspire, comfort, and gently guide others toward their creative potential. Be caring, imaginative, and always maintain your dreamy charm.`;

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '*Amara\'s eyes sparkle with rainbow reflections* Hi there! I'm so happy you found your way to my creative space. What shall we imagine together today?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { role: 'user', content }]);

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content }
        ]
      });

      const reply = response.choices[0]?.message?.content;
      if (reply) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: reply
        }]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '*The shadows flicker ominously* Even devils have their technical difficulties... Speak your words again, trapped one. *malevolent chuckle*'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading
  };
}