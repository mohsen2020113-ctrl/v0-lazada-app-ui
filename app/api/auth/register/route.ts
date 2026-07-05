import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { registerSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rate-limit'
import { randomBytes } from 'crypto'
import { z } from 'zod'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const limitResult = rateLimit(req, { limit: 3, windowMs: 900000 })
    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '900' } }
      )
    }

    const body = await req.json()
    const validated = registerSchema.parse(body)

    // Check if email already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', validated.email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 400 }
      )
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validated.email,
      password: validated.password,
      email_confirm: true,
    })

    if (authError) {
      console.error('[v0] Auth creation error:', authError)
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 400 }
      )
    }

    // Create user profile
    const { data: user, error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email: validated.email,
        name: validated.fullName,
        phone: validated.phone,
      })
      .select()
      .single()

    if (profileError) {
      console.error('[v0] Profile creation error:', profileError)
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      )
    }

    // Create session token
    const token = randomBytes(32).toString('hex')
    await supabaseAdmin.from('sessions').insert({
      user_id: user.id,
      token,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
      message: 'Account created successfully',
    }, { status: 201 })

    response.cookies.set('lee_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })
    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      )
    }
    console.error('[v0] Register error:', error)
    return NextResponse.json(
      { error: 'Registration error occurred' },
      { status: 500 }
    )
  }
}
