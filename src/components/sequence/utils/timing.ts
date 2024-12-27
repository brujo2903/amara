export function calculateTypingDelay(char: string, baseSpeed: number): number {
  if (char.match(/[,.?!]/)) {
    return baseSpeed * 3;  // Longer pause for punctuation
  }
  if (char === ' ') {
    return baseSpeed * 1.5;  // Medium pause for spaces
  }
  return baseSpeed;
}