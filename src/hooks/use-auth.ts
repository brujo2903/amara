import { useState, useEffect, useRef } from 'react';
import { signInWithPhantom, signOut, getSession, subscribeToAuthChanges } from '@/lib/solana/auth';
import { useToast } from './use-toast';
import { cn } from '@/lib/utils';
import type { Session } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Track mounted state to prevent state updates after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const initAuth = async () => {
      try {
        const initialSession = await getSession();
        if (isMounted.current) {
          setSession(initialSession);
        }
        
        // Setup auth subscription
        unsubscribe = subscribeToAuthChanges((newSession: Session | null) => {
          if (isMounted.current) {
            setSession(newSession);
          }
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Check if Phantom is installed
      const phantom = (window as any).phantom?.solana;
      if (!phantom?.isPhantom) {
        window.open('https://phantom.app', '_blank');
        throw new Error('Please install Phantom wallet from phantom.app');
      }

      // Check if already connected
      if (phantom.isConnected) {
        await phantom.disconnect();
      }
      
      const data = await signInWithPhantom();
      if (data?.session) {
        setSession(data.session);
      
        toast({
          title: "Connected to the void",
          description: "Your soul is now bound to the digital realm.",
          duration: 2000,
          className: cn(
            "bg-black/95 border-red-600/30 backdrop-blur-md",
            "font-['VT323'] text-red-400",
            "shadow-[0_0_20px_rgba(220,38,38,0.3)]"
          )
        });
      } else {
        throw new Error('Failed to authenticate with wallet');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Connection failed...",
        description: error instanceof Error ? error.message : "The void rejects your presence.",
        variant: "destructive",
        duration: 2000,
        className: cn(
          "bg-black/95 border-red-600/30 backdrop-blur-md",
          "font-['VT323'] text-red-500",
          "shadow-[0_0_20px_rgba(220,38,38,0.3)]"
        )
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      
      // Disconnect from Phantom first
      const phantom = (window as any).phantom?.solana;
      if (phantom?.isConnected) {
        await phantom.disconnect();
      }
      
      // Then sign out from Supabase
      await signOut();
      setSession(null);
      
      toast({
        title: "Disconnected...",
        description: "Your soul has been released... for now.",
        duration: 2000,
        className: cn(
          "bg-black/95 border-red-600/30 backdrop-blur-md",
          "font-['VT323'] text-red-400",
          "shadow-[0_0_20px_rgba(220,38,38,0.3)]"
        )
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Disconnection failed...",
        description: "The void maintains its grip on your soul.",
        variant: "destructive",
        duration: 2000,
        className: "bg-black/95 border-red-600/30 backdrop-blur-md font-['VT323']"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
    signIn: handleSignIn,
    signOut: handleSignOut
  };
}