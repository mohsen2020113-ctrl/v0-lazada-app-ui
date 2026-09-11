import { cookies } from 'next/headers'
import { supabaseAdmin } from './supabase'
import { NextRequest } from 'next/server'

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('lee_session')?.value

    if (!token) return null

    const { data: session, error } = await supabaseAdmin
      .from('sessions')
      .select('user_id, expires_at')
      .eq('token', token)
      .single()

    if (error || !session) return null

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      cookieStore.delete('lee_session')
      return null
    }

    return { userId: session.user_id, token }
  } catch (error) {
    console.error('[v0] Session error:', error)
    return null
  }
}

export async function getCurrentUser() {
  try {
    const session = await getSession()
    if (!session) return null

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', session.userId)
      .single()

    if (error || !user) return null

    return user
  } catch (error) {
    console.error('[v0] User fetch error:', error)
    return null
  }
}

export function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get('lee_session')?.value
  return token || null
}

export async function validateSessionToken(token: string) {
  try {
    const { data: session, error } = await supabaseAdmin
      .from('sessions')
      .select('user_id, expires_at')
      .eq('token', token)
      .single()

    if (error || !session) return null

    if (new Date(session.expires_at) < new Date()) {
      return null
    }

    return { userId: session.user_id }
  } catch (error) {
    console.error('[v0] Token validation error:', error)
    return null
  }
}

export async function refreshSession(token: string) {
  try {
    const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    
    const { error } = await supabaseAdmin
      .from('sessions')
      .update({ expires_at: newExpiry })
      .eq('token', token)

    if (error) return null

    return { newExpiry }
  } catch (error) {
    console.error('[v0] Session refresh error:', error)
    return null
  }
}
