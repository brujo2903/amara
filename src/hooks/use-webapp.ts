import { useState, useEffect } from 'react';
import { generateInitialCode } from '@/lib/webapp-generator';
import { checkWebAppExists, createWebApp, fetchWebApp } from '@/lib/webapp/queries';
import { validateWebAppInput, validateSession } from '@/lib/webapp/validation';
import { WEBAPP_ERRORS } from '@/lib/webapp/errors';
import type { WebAppFormData, WebApp } from '@/types/webapp';

export function useWebApp(webAppId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [webApp, setWebApp] = useState<WebApp | null>(null);

  useEffect(() => {
    if (!webAppId) return;

    let mounted = true;
    const loadWebApp = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWebApp(webAppId);
        if (mounted) {
          setWebApp(data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to load web app:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load web app');
          setWebApp(null);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadWebApp();
    return () => { mounted = false; };
  }, [webAppId]);

  const handleCreateWebApp = async (formData: WebAppFormData): Promise<WebApp> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate inputs
      validateWebAppInput(formData);

      // Get and validate session
      const session = localStorage.getItem('session') ? 
        JSON.parse(localStorage.getItem('session')!) : null;
      
      if (!session?.id) {
        throw WEBAPP_ERRORS.NO_SESSION;
      }

      // Check if name exists
      const exists = await checkWebAppExists(formData.name);
      if (exists) throw WEBAPP_ERRORS.NAME_EXISTS;

      // Generate initial code
      const generatedCode = await generateInitialCode(formData);

      // Create web app
      const webApp = await createWebApp({
        ...formData,
        code: generatedCode
      }, session.id);

      return webApp;
    } catch (err) {
      console.error('Create web app error:', err);
      const message = err instanceof Error ? err.message : 'Failed to create web app';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isOwner = webApp?.session_id === 
    (localStorage.getItem('session') ? 
      JSON.parse(localStorage.getItem('session')!).id : null);

  return {
    createWebApp: handleCreateWebApp,
    isOwner,
    isLoading,
    error,
    webApp,
    clearError: () => setError(null)
  };
}