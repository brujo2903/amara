import type { WebAppFormData } from '@/types/webapp';

// Extract and validate JSON from OpenAI response
export function parseCodeResponse(content: string | undefined) {
  if (!content) {
    throw new Error('No response content');
  }

  // Extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response');
  }

  const code = JSON.parse(jsonMatch[0]);

  // Validate the structure
  if (!code.html || !code.css || !code.js) {
    throw new Error('Invalid code structure in response');
  }

  return code;
}

// Generate fallback code for error cases
export function getFallbackCode() {
  return {
    html: '<div class="error">Failed to generate code</div>',
    css: '.error { color: red; }',
    js: 'console.error("Code generation failed");'
  };
}

// Generate unique name for web apps
export function generateName(formData: WebAppFormData): string {
  const timestamp = Date.now().toString(36);
  return `web-creation-${timestamp}`;
}