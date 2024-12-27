export const SEQUENCE_TIMING = {
  typingSpeed: 35,        // Base typing speed (ms per character)
  shortPause: 150,        // Short pause between actions
  mediumPause: 300,       // Medium pause for emphasis
  longPause: 400,         // Long pause for major transitions
  fadeTime: 1000,         // Fade transition duration
  keypadDelay: 500,       // Keypad entrance delay - Faster appearance
  digitEntry: 1000,       // Digit entry speed
  avatarTransition: 5000, // Avatar transition duration
  finalPause: 150,        // Final transition pause - Even faster for smoother flow
  completePause: 400,     // Pause after text completion
} as const;

export const MESSAGES = {
  initial: [
    "Welcome"
  ],
  morvak: "morvak",
  escape: [],
  final: "You are here forever...",
} as const;