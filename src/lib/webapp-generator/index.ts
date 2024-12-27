import { openai } from '@/lib/openai';
import { SYSTEM_PROMPTS } from './prompts';
import { parseCodeResponse, getFallbackCode } from './utils';
import type { WebAppFormData } from '@/types/webapp';


export async function generateInitialCode(formData: WebAppFormData) {
  const prompt = `Create a web application based on this description:
"${formData.description}"

Requirements:
- Use modern HTML5, CSS3 and JavaScript
- Implement responsive design
- Follow cyberpunk/dark theme aesthetic with red accents
- Add smooth animations and transitions
- Include error handling
- Add helpful comments

Additional Context:
- Focus on creating an immersive user experience
- Use pixel art and retro-futuristic elements where appropriate
- Implement smooth transitions and glitch effects
- Ensure cross-browser compatibility
- Add proper error handling and loading states`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.generate
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Extract code sections using regex
    const htmlMatch = content.match(/```html\n([\s\S]*?)```/);
    const cssMatch = content.match(/```css\n([\s\S]*?)```/);
    const jsMatch = content.match(/```javascript\n([\s\S]*?)```/);

    return {
      html: htmlMatch?.[1]?.trim() || getFallbackCode().html,
      css: cssMatch?.[1]?.trim() || getFallbackCode().css,
      js: jsMatch?.[1]?.trim() || getFallbackCode().js
    };
  } catch (err) {
    console.error('Failed to generate initial code:', err);
    return getFallbackCode();
  }
}

export async function refineCode(formData: WebAppFormData, userFeedback: string) {
  const prompt = `Refine this web application based on the feedback: "${userFeedback}"

Current code:
${JSON.stringify(formData.code, null, 2)}

Requirements:
- Maintain dark theme and cyberpunk aesthetic
- Keep existing functionality
- Implement requested changes
- Follow best practices
- Ensure smooth transitions
- Add proper error handling`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 4000,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.refine
        },
        { role: 'user', content: prompt }
      ]
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Extract code sections
    const htmlMatch = content.match(/```html\n([\s\S]*?)```/);
    const cssMatch = content.match(/```css\n([\s\S]*?)```/);
    const jsMatch = content.match(/```javascript\n([\s\S]*?)```/);

    return {
      html: htmlMatch?.[1]?.trim() || formData.code.html,
      css: cssMatch?.[1]?.trim() || formData.code.css,
      js: jsMatch?.[1]?.trim() || formData.code.js
    };
  } catch (err) {
    console.error('Failed to refine code:', err);
    return formData.code;
  }
}

export function generateName(formData: WebAppFormData): string {
  const timestamp = Date.now().toString(36);
  return `web-creation-${timestamp}`;
}