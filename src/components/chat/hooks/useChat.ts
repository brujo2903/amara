import { useState } from 'react';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '../config/prompts';
import type { Message } from '../types';

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'This feature will emerge soon... but time holds no meaning here, does it?'
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