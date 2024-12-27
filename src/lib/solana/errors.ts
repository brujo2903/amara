export class SolanaError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'SolanaError';
  }
}

export class TokenError extends SolanaError {
  constructor(message: string, code?: string) {
    super(message, code);
    this.name = 'TokenError';
  }
}

export class RPCError extends SolanaError {
  constructor(message: string, code?: string) {
    super(message, code);
    this.name = 'RPCError';
  }
}