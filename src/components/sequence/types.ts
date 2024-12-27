export type SequenceStep = 
  | 'initial' 
  | 'avatar'
  | 'escape'
  | 'final' 
  | 'complete';

export interface SequenceTiming {
  typingSpeed: number;
  shortPause: number;
  mediumPause: number;
  longPause: number;
  fadeTime: number;
  keypadDelay: number;
  digitEntry: number;
  avatarTransition: number;
  finalPause: number;
  completePause: number;
}