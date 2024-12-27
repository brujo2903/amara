import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  signInWithPhantom, 
  disconnectWallet,
  checkIfPhantomInstalled 
} from '@/lib/phantom';
import type { WalletState } from '@/lib/phantom/types';
import { PHANTOM_ERRORS } from '@/lib/phantom/errors';

export function usePhantom() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    publicKey: null,
    isLoading: false,
    error: null
  });
  
  const { toast } = useToast();

  const connect = useCallback(async () => {
    if (!checkIfPhantomInstalled()) {
      window.open('https://phantom.app', '_blank');
      throw PHANTOM_ERRORS.NOT_INSTALLED;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await signInWithPhantom();
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        error: null
      }));

      toast({
        title: "Connected to the void...",
        description: "Your soul is now bound to the digital realm.",
        className: cn(
          "bg-black/95 border-red-600/30 backdrop-blur-md",
          "font-['VT323'] text-red-400",
          "shadow-[0_0_20px_rgba(220,38,38,0.3)]"
        )
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      setState(prev => ({ ...prev, error: message }));
      
      toast({
        title: "Connection failed...",
        description: message,
        variant: "destructive",
        className: cn(
          "bg-black/95 border-red-600/30 backdrop-blur-md",
          "font-['VT323'] text-red-500",
          "shadow-[0_0_20px_rgba(220,38,38,0.3)]"
        )
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [toast]);

  const disconnect = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await disconnectWallet();
      
      setState({
        isConnected: false,
        publicKey: null,
        isLoading: false,
        error: null
      });

      toast({
        title: "Disconnected...",
        description: "Your soul has been released... for now.",
        className: cn(
          "bg-black/95 border-red-600/30 backdrop-blur-md",
          "font-['VT323'] text-red-400",
          "shadow-[0_0_20px_rgba(220,38,38,0.3)]"
        )
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to disconnect wallet';
      setState(prev => ({ ...prev, error: message }));
      
      toast({
        title: "Disconnection failed...",
        description: message,
        variant: "destructive",
        className: cn(
          "bg-black/95 border-red-600/30 backdrop-blur-md",
          "font-['VT323'] text-red-500"
        )
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [toast]);

  return {
    ...state,
    connect,
    disconnect
  };
}