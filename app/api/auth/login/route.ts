import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password })
  if (error) return NextResponse.json({ error: error.message }, { status: 401 })

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single()

  const token = randomBytes(32).toString('hex')
  await supabaseAdmin.from('sessions').insert({
    user_id: data.user.id,
    token,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  })

  const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name }, token })
  response.cookies.set('lee_session', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60, path: '/' })
  return response
}
