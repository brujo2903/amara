import { PublicKey } from '@solana/web3.js';

export interface PhantomWindow extends Window {
  phantom?: {
    solana?: PhantomProvider;
  };
}

export interface PhantomProvider {
  isPhantom?: boolean;
  publicKey: PublicKey | null;
  isConnected: boolean;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
}

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  isLoading: boolean;
  error: string | null;
}