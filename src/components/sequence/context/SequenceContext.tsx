import { createContext, useContext, useState, type ReactNode } from 'react';
import { SEQUENCE_TIMING } from '../config';
import type { SequenceStep } from '../types';

interface SequenceContextValue {
  currentStep: SequenceStep;
  currentMessageIndex: number;
  timing: typeof SEQUENCE_TIMING;
  transition: (nextStep: SequenceStep | 'next') => void;
}

const SequenceContext = createContext<SequenceContextValue | null>(null);

export function SequenceProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<SequenceStep>('avatar');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const transition = (nextStep: SequenceStep | 'next') => {
    if (nextStep === 'next') {
      setCurrentMessageIndex(prev => prev + 1);
    } else {
      setCurrentStep(nextStep);
      setCurrentMessageIndex(0);
    }
  };

  return (
    <SequenceContext.Provider value={{
      currentStep,
      currentMessageIndex,
      timing: SEQUENCE_TIMING,
      transition
    }}>
      {children}
    </SequenceContext.Provider>
  );
}

export function useSequenceContext() {
  const context = useContext(SequenceContext);
  if (!context) {
    throw new Error('useSequenceContext must be used within a SequenceProvider');
  }
  return context;
}