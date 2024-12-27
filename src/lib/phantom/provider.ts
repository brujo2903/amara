import { PhantomWindow, PhantomProvider } from './types';
import { PHANTOM_ERRORS } from './errors';

export function getProvider(): PhantomProvider {
  if (typeof window === 'undefined') {
    throw PHANTOM_ERRORS.INVALID_STATE;
  }

  const win = window as PhantomWindow;
  const provider = win?.phantom?.solana;

  if (!provider?.isPhantom) {
    throw PHANTOM_ERRORS.NOT_INSTALLED;
  }

  return provider;
}

export function checkIfPhantomInstalled(): boolean {
  try {
    const provider = getProvider();
    return Boolean(provider?.isPhantom);
  } catch {
    return false;
  }
}