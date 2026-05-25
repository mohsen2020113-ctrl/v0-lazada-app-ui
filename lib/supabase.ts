import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Public client (browser-safe) — only created if env vars are present
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any)

// Server client (full access, server-side only)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : (null as any)

// Safe wrapper — returns defaultValue when Supabase is unavailable
export async function safeSupabaseCall<T>(
  fn: () => Promise<T>,
  defaultValue: T
): Promise<T> {
  if (!supabase) return defaultValue
  try {
    return await fn()
  } catch {
    return defaultValue
  }
}
