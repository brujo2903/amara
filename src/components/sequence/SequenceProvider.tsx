import { createContext, useContext, type ReactNode } from 'react';
import { useSequence } from '@/hooks/use-sequence';

const SequenceContext = createContext<ReturnType<typeof useSequence> | null>(null);

export function SequenceProvider({ children }: { children: ReactNode }) {
  const sequence = useSequence();
  return (
    <SequenceContext.Provider value={sequence}>
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