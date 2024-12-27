import { PublicKey } from '@solana/web3.js';
import { supabase } from '@/lib/supabase';
import bs58 from 'bs58';
import { Session, AuthError } from '@supabase/supabase-js';

// Custom error class for Phantom-specific errors
export class PhantomError extends Error {
  constructor(
    message: string,
    public readonly code?: number,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'PhantomError';
  }
}

// Type definitions for Phantom wallet
interface PhantomProvider {
  isPhantom?: boolean;
  connect(): Promise<{ publicKey: PublicKey }>;
  disconnect(): Promise<void>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  isConnected: boolean;
}

interface Window {
  phantom?: {
    solana?: PhantomProvider;
  };
}

// Generate cryptographically secure nonce
function generateNonce(): string {
  try {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    throw new PhantomError('Failed to generate secure nonce', undefined, error as Error);
  }
}

// Get Phantom provider with type checking
function getPhantomProvider(): PhantomProvider {
  const phantom = (window as Window).phantom?.solana;
  
  if (!phantom?.isPhantom) {
    throw new PhantomError(
      'Phantom wallet not installed. Please install Phantom to continue.',
      4000
    );
  }
  
  return phantom;
}

export async function signInWithPhantom(): Promise<{ session: Session | null }> {
  try {
    const phantom = getPhantomProvider();
    
    // Request connection to Phantom
    if (phantom.isConnected) {
      await phantom.disconnect();
    }
    
    const { publicKey } = await phantom.connect();
    
    if (!publicKey) {
      throw new PhantomError('Failed to connect to Phantom wallet', 4003);
    }
    
    const walletAddress = new PublicKey(publicKey.toString());
    const nonce = generateNonce();
    
    // Create message for signing
    const message = new TextEncoder().encode(
      `Welcome to Morvak\n\nSign this message to authenticate.\nNonce: ${nonce}`
    );
    
    // Request signature
    const signatureBytes = await phantom.signMessage(message);
    const signatureBase58 = bs58.encode(signatureBytes);
    
    // Try sign in first
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${walletAddress.toString()}@phantom.wallet`,
        password: signatureBase58,
      });
      
      if (error?.message?.includes('Invalid login credentials')) {
        // User doesn't exist, create new account
        return await supabase.auth.signUp({
          email: `${walletAddress.toString()}@phantom.wallet`,
          password: signatureBase58,
          options: {
            data: {
              wallet_address: walletAddress.toString(),
              nonce
            }
          }
        });
      }
      
      if (error) throw error;
      return data;      
    } catch (err) {
      console.error('Auth error:', err);
      throw new PhantomError(
        'Failed to authenticate wallet',
        undefined,
        err instanceof Error ? err : new Error(String(err))
      );
    }
    
  } catch (error) {
    // Handle specific error cases
    if (error instanceof PhantomError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.message.includes('User rejected')) {
        throw new PhantomError('Connection rejected. Please approve the connection request.', 4001);
      }
    }
    
    // Log and rethrow unknown errors
    console.error('Phantom authentication error:', error);
    throw new PhantomError('Failed to authenticate with wallet', undefined, error as Error);
  }
}

export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Also disconnect from Phantom
    const phantom = getPhantomProvider();
    if (phantom.isConnected) {
      await phantom.disconnect();
    }
  } catch (error) {
    throw new PhantomError('Failed to sign out', undefined, error as Error);
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    throw new PhantomError('Failed to get session', undefined, error as Error);
  }
}

export function subscribeToAuthChanges(
  callback: (session: Session | null) => void
): (() => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session);
    }
  );
  
  return () => {
    subscription.unsubscribe();
  };
}