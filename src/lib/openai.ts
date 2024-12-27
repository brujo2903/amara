import OpenAI from 'openai';
import { OPENAI_API_KEY, OPENAI_CONFIG } from './config/openai';

if (!OPENAI_API_KEY) {
  throw new Error('OpenAI API key is not configured');
}

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export class OpenAIError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'OpenAIError';
  }
}

export async function handleOpenAIError(error: unknown): Promise<never> {
  console.error('OpenAI API Error:', error);
  
  if (error instanceof Error) {
    if (error.message.includes('invalid_api_key')) {
      throw new OpenAIError('API configuration error. Please try again later.');
    }
    throw new OpenAIError(error.message);
  }
  
  throw new OpenAIError('An unexpected error occurred. Please try again.');
}