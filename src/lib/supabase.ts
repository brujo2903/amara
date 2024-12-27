import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znyskltnyhjxqabwoqcx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpueXNrbHRueWhqeHFhYndvcWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NTg4OTIsImV4cCI6MjA1MDAzNDg5Mn0.vMDZ9Cz0nD2LuAGBTg4sHumrAeCmNlL91j-sJkXHOKI';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
  }
  return supabaseInstance;
}

export const supabase = getSupabase();