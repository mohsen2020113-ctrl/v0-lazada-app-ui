import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Returns null if env vars are missing
export const supabase = 
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Null-safe helper functions
export const isSupabaseEnabled = () => supabase !== null;

export async function safeSupabaseCall<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!supabase) return fallback;
  try {
    return await fn();
  } catch (error) {
    console.error('[Supabase] Error:', error);
    return fallback;
  }
}
