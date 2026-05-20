import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  const { email, password, name, phone, country_code = 'AE' } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  // Create auth user in Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  // Create user profile
  const { data: user, error: profileError } = await supabaseAdmin
    .from('users')
    .insert({ id: authData.user.id, email, name, phone, country_code })
    .select()
    .single()

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  // Create session token
  const token = randomBytes(32).toString('hex')
  await supabaseAdmin.from('sessions').insert({
    user_id: user.id,
    token,
    country_code,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  })

  const response = NextResponse.json({ user: { id: user.id, email, name }, token })
  response.cookies.set('lee_session', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60, path: '/' })
  return response
}
