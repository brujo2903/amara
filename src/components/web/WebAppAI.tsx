import { type FC, useState, FormEvent } from 'react';
import OpenAI from 'openai';
import { cn } from '@/lib/utils';
import { Wand2 } from 'lucide-react';
import type { WebAppFormData } from '@/types/webapp';

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

interface WebAppAIProps {
  onSuggest: (suggestion: Partial<WebAppFormData['code']>) => void;
}

export const WebAppAI: FC<WebAppAIProps> = ({ onSuggest }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert web developer specializing in creating dark-themed, 
                     cyberpunk-styled web applications with red accents. Generate code based 
                     on user prompts, ensuring modern best practices and clean code.`
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const suggestion = response.choices[0]?.message?.content;
      if (suggestion) {
        try {
          const parsedSuggestion = JSON.parse(suggestion);
          onSuggest(parsedSuggestion);
        } catch (err) {
          console.error('Failed to parse AI suggestion:', err);
        }
      }
    } catch (err) {
      console.error('Failed to get AI suggestion:', err);
    }
    setIsLoading(false);
    setPrompt('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-xl text-red-400 font-['VT323']">
        AI Assistance
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to create..."
          className={cn(
            "flex-1 bg-black/60 border-2 border-red-600/30 rounded p-3",
            "text-red-200 font-['VT323'] text-lg placeholder:text-red-400/50",
            "focus:outline-none focus:border-red-500/50 focus:bg-red-950/40",
            "transition-all duration-200"
          )}
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
          className={cn(
            "px-4 bg-red-900/40 border-2 border-red-600/30 rounded",
            "text-red-200 font-['VT323'] text-lg",
            "hover:bg-red-800/40 focus:outline-none focus:ring-2 focus:ring-red-600/50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200",
            "flex items-center gap-2"
          )}
        >
          <Wand2 className="w-5 h-5" />
          <span>Generate</span>
        </button>
      </div>
    </div>
  );
};