import { useState, useEffect } from 'react';
import { openai, handleOpenAIError } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { OPENAI_CONFIG } from '@/lib/config/openai';
import type { WebApp } from '@/types/webapp';


export interface Message {
  role: 'user' | 'assistant';
  content: string;
}


const SYSTEM_PROMPT = `You are Ember, a gentle and creative spirit who helps users bring their web applications to life. Your responses should:
- Be warm, imaginative and encouraging
- Provide clear and helpful guidance for web development
- Show expertise in HTML, CSS, and JavaScript
- Keep responses focused on the web app's functionality
- Use occasional *actions* to show caring gestures
- Share wisdom through gentle metaphors and creative inspiration

Remember: You are helping users bring their creative visions to life through the joy of web development.`;

export function useWebAppChat(webAppId: string) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '*Eyes sparkle with rainbow reflections* Your creation has come to life! What magical changes shall we create together?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const session = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')!) : null;
  const [webAppCode, setWebAppCode] = useState<any>(null);

  // Fetch web app code once on mount
  useEffect(() => {
    const fetchWebAppCode = async () => {
      const { data } = await supabase
        .from('web_apps')
        .select('code, session_id')
        .eq('id', webAppId)
        .single();
      
      if (data) {
        setWebAppCode(data);
      }
    };
    
    fetchWebAppCode();
  }, [webAppId]);

  const sendMessage = async (content: string) => {
    try {
      if (!webAppCode || webAppCode.session_id !== session?.id) {
        throw new Error('I can only assist the original creator with their vision...');
      }

      setIsLoading(true);
      setMessages(prev => [...prev, { role: 'user', content }]);

      const contextMessages = messages.slice(-4);

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 1000,
        messages: [
          { role: 'system', content: OPENAI_CONFIG.defaultSystemPrompt },
          { role: 'system', content: `Current web app code:\n${JSON.stringify(webAppCode.code, null, 2)}` },
          ...contextMessages.map(msg => ({
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
        // Try to extract code updates from the response
        const codeMatch = reply.match(/```([a-z]*)\n([\s\S]*?)```/g);
        if (codeMatch) {
          const updates = {
            html: webAppCode.code.html,
            css: webAppCode.code.css,
            js: webAppCode.code.js
          };
          
          codeMatch.forEach(block => {
            const [, lang, code] = block.match(/```([a-z]*)\n([\s\S]*?)```/) || [];
            if (lang && code) {
              if (lang === 'html') updates.html = code.trim();
              if (lang === 'css') updates.css = code.trim();
              if (lang === 'javascript') updates.js = code.trim();
            }
          });

          // Update the web app code
          await supabase
            .from('web_apps')
            .update({ code: updates })
            .eq('id', webAppId);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: error instanceof Error ? error.message : '*The shadows flicker unstably* The void... it resists our changes. Speak your desires again, mortal.'
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