import { openai } from '@/lib/openai';
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
- Add helpful comments`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert web developer specializing in creating dark-themed, cyberpunk-styled web applications. Generate code that follows modern best practices and maintains a consistent aesthetic. Return code in markdown code blocks for HTML, CSS, and JavaScript.'
        },
        { role: 'user', content: prompt }
      ]
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
      html: htmlMatch?.[1]?.trim() || '<div class="app">Failed to generate code</div>',
      css: cssMatch?.[1]?.trim() || '.app { color: red; }',
      js: jsMatch?.[1]?.trim() || 'console.error("Code generation failed");'
    };
  } catch (err) {
    console.error('Failed to generate initial code:', err);
    return {
      html: '<div class="app">Failed to generate code</div>',
      css: '.app { color: red; }',
      js: 'console.error("Code generation failed");'
    };
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
- Follow best practices`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert web developer specializing in refining and optimizing web applications. Modify code based on user feedback while maintaining established aesthetic and quality.'
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