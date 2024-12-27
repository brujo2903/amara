import { useCallback } from 'react';
import { cn } from '@/lib/utils';

export function useKeypadTransition() {
  const createTransitionOverlay = useCallback(() => {
    const overlay = document.createElement('div');
    overlay.className = cn(
      "fixed inset-0 bg-black z-[100]",
      "transition-opacity duration-1000 ease-in-out"
    );
    overlay.style.opacity = '0';
    document.body.appendChild(overlay);
    return overlay;
  }, []);

  const executeTransition = useCallback((
    overlay: HTMLDivElement,
    onComplete: () => void,
    navigate: (path: string, options: { replace: boolean }) => void
  ) => {
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      setTimeout(() => {
        onComplete();
        navigate('/home', { replace: true });
        setTimeout(() => {
          overlay.style.opacity = '0';
          setTimeout(() => overlay.remove(), 1000);
        }, 100);
      }, 1000);
    });
  }, []);

  return {
    createTransitionOverlay,
    executeTransition
  };
}