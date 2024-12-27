export class PhantomError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'PhantomError';
  }
}

export const PHANTOM_ERRORS = {
  NOT_INSTALLED: new PhantomError(
    'Phantom wallet is not installed. Please install it from phantom.app',
    'PHANTOM_NOT_INSTALLED'
  ),
  USER_REJECTED: new PhantomError(
    'Connection rejected. Please approve the connection request.',
    'USER_REJECTED'
  ),
  CONNECTION_FAILED: new PhantomError(
    'Failed to connect to Phantom wallet.',
    'CONNECTION_FAILED'
  ),
  ALREADY_CONNECTED: new PhantomError(
    'Wallet is already connected.',
    'ALREADY_CONNECTED'
  ),
  INVALID_STATE: new PhantomError(
    'Invalid wallet state.',
    'INVALID_STATE'
  )
} as const;