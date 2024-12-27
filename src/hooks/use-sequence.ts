import { useState, useCallback } from 'react';

export type SequenceStep = 
  | 'initial' 
  | 'taunt' 
  | 'keypad' 
  | 'final' 
  | 'avatar' 
  | 'complete';

export type SequenceTiming = typeof SEQUENCE_TIMING;

export const SEQUENCE_TIMING = {
  typingSpeed: 120,       // Base typing speed (ms per character)
  shortPause: 1500,       // Short pause between actions
  mediumPause: 2500,      // Medium pause for emphasis
  longPause: 3500,        // Long pause for major transitions
  fadeTime: 1000,         // Fade transition duration
  keypadDelay: 2000,      // Keypad entrance delay
  digitEntry: 1000,       // Digit entry speed
  avatarTransition: 5000, // Avatar transition duration
  finalPause: 5000,       // Final transition pause
  completePause: 2000,    // Pause after text completion
} as const;

export function useSequence() {
  const [currentStep, setCurrentStep] = useState<SequenceStep>('initial');

  const transition = useCallback((nextStep: SequenceStep) => {
    setCurrentStep(nextStep);
  }, []);

  return {
    currentStep,
    transition,
    timing: SEQUENCE_TIMING,
  };
}