import { PublicKey } from '@solana/web3.js';
import { getProvider } from './provider';
import { PHANTOM_ERRORS } from './errors';
import { supabase } from '@/lib/supabase';
import bs58 from 'bs58';

function generateNonce(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function connectWallet(): Promise<{ publicKey: string }> {
  try {
    const provider = getProvider();
    
    if (provider.isConnected) {
      await provider.disconnect();
    }

    const { publicKey } = await provider.connect();
    
    if (!publicKey) {
      throw PHANTOM_ERRORS.CONNECTION_FAILED;
    }

    return { publicKey: publicKey.toString() };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('User rejected')) {
        throw PHANTOM_ERRORS.USER_REJECTED;
      }
    }
    throw PHANTOM_ERRORS.CONNECTION_FAILED;
  }
}

export async function signInWithPhantom(): Promise<void> {
  try {
    const { publicKey } = await connectWallet();
    const walletAddress = new PublicKey(publicKey);
    const nonce = generateNonce();
    
    const message = new TextEncoder().encode(
      `Welcome to Morvak\n\nSign this message to authenticate.\nNonce: ${nonce}`
    );
    
    const provider = getProvider();
    const { signature } = await provider.signMessage(message);
    const signatureBase58 = bs58.encode(signature);
    
    // Try sign in first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: `${walletAddress.toString()}@phantom.wallet`,
      password: signatureBase58,
    });
    
    // If user doesn't exist, create new account
    if (signInError?.message?.includes('Invalid login credentials')) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: `${walletAddress.toString()}@phantom.wallet`,
        password: signatureBase58,
        options: {
          data: {
            wallet_address: walletAddress.toString(),
            nonce
          }
        }
      });
      
      if (signUpError) throw signUpError;
    } else if (signInError) {
      throw signInError;
    }
  } catch (error) {
    console.error('Phantom authentication error:', error);
    throw PHANTOM_ERRORS.CONNECTION_FAILED;
  }
}

export async function disconnectWallet(): Promise<void> {
  try {
    const provider = getProvider();
    if (provider.isConnected) {
      await provider.disconnect();
    }
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Disconnect error:', error);
    throw PHANTOM_ERRORS.CONNECTION_FAILED;
  }
}