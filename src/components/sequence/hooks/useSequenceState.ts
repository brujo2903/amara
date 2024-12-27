import { useState, useCallback } from 'react';
import type { SequenceStep } from '../types';
import { SEQUENCE_TIMING } from '../config';

export function useSequenceState() {
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