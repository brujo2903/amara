import { supabase } from '@/lib/supabase';
import { WEBAPP_ERRORS } from './errors';
import type { WebApp, WebAppFormData } from '@/types/webapp';

export async function checkWebAppExists(name: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('web_apps')
    .select('original_name')
    .eq('original_name', name.trim())
    .maybeSingle();
    
  if (error) throw error;
  return !!data;
}

export async function createWebApp(
  formData: WebAppFormData, 
  sessionId: string
): Promise<WebApp> {
  if (!sessionId) {
    throw WEBAPP_ERRORS.NO_SESSION;
  }

  const { data, error } = await supabase
    .from('web_apps')
    .insert({
      name: formData.name.trim(),
      original_name: formData.name.trim(),
      description: formData.description.trim(),
      code: formData.code,
      session_id: sessionId,
      published: false
    })
    .select()
    .single();

  if (error) {
    console.error('Create web app error:', error);
    throw WEBAPP_ERRORS.CREATION_FAILED;
  }
  
  if (!data) throw WEBAPP_ERRORS.CREATION_FAILED;
  return data;
}

export async function fetchWebApp(id: string): Promise<WebApp | null> {
  const { data, error } = await supabase
    .from('web_apps')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Fetch web app error:', error);
    throw WEBAPP_ERRORS.FETCH_FAILED;
  }

  return data;
}