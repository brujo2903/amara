import { useState, useEffect } from 'react';
import { openai, handleOpenAIError } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { useEntity } from '@/hooks/use-entity';
import type { EntityMessage } from '@/types/entity';


function generateWelcomeMessage(entity: any): string {
  const greetings = [
    '*Amara\'s eyes sparkle with gentle warmth* Welcome to our creative space!',
    '*A soft rainbow aura shimmers* So happy you\'re here!',
    '*Radiating gentle energy* Ready to explore together?',
    '*Surrounded by gentle starlight* Welcome to our magical space!'
  ];

  // Personalize based on entity traits
  if (entity?.personality?.toLowerCase().includes('creative')) {
    greetings.push(
      '*Colorful sparkles dance around* Ready to create something beautiful?',
      '*Paint brushes and stars float by* Let\'s bring your vision to life!'
    );
  }

  if (entity?.personality?.toLowerCase().includes('empathetic')) {
    greetings.push(
      '*A warm, comforting glow surrounds us* I\'m here to listen and understand',
      '*Gentle rainbow lights swirl* Let\'s explore your thoughts together'
    );
  }

  if (entity?.knowledge?.toLowerCase().includes('art')) {
    greetings.push(
      '*Paintbrushes and colors dance in the air* Ready to create something magical?',
      '*A canvas of possibilities unfolds* What shall we create today?'
    );
  }

  // Select a random greeting
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
}


export function useEntityChat(entityId: string) {
  const [messages, setMessages] = useState<EntityMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { entity } = useEntity(entityId);
  const [systemPrompt, setSystemPrompt] = useState<string | null>(null);

  // Fetch system prompt once when component mounts
  useEffect(() => {
    const fetchSystemPrompt = async () => {
      const { data } = await supabase
        .from('entities')
        .select('system_prompt')
        .eq('id', entityId)
        .single();
      
      if (data?.system_prompt) {
        setSystemPrompt(data.system_prompt);
      }
    };
    
    fetchSystemPrompt();
  }, [entityId]);

  useEffect(() => {
    if (entity?.name) {
      setMessages([{
        role: 'assistant',
        content: generateWelcomeMessage(entity)
      }]);
    }
  }, [entity?.name]);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { role: 'user', content }]);

      const currentSystemPrompt = systemPrompt || OPENAI_CONFIG.defaultSystemPrompt;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 300,
        messages: [
          { role: 'system', content: currentSystemPrompt },
          // Only include last few messages for context
          ...messages.slice(-4).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content }
        ]
      }).catch(handleOpenAIError);

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
        content: '*A gentle frown crosses my face* Oh dear, something went wrong. Let\'s try that again with a sprinkle more magic!'
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
};