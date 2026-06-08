import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { loginSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rate-limit'
import { randomBytes } from 'crypto'
import { z } from 'zod'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const limitResult = rateLimit(req, { limit: 5, windowMs: 900000 })
    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'عدد محاولات الدخول تم تجاوزه. حاول لاحقاً.' },
        { status: 429, headers: { 'Retry-After': '900' } }
      )
    }

    const body = await req.json()
    const validated = loginSchema.parse(body)

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    })

    if (error) {
      console.error('[v0] Auth error:', error)
      return NextResponse.json(
        { error: 'بريد إلكتروني أو كلمة مرور غير صحيحة' },
        { status: 401 }
      )
    }

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

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    })
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
        { error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      )
    }
    console.error('[v0] Login error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في المصادقة' },
      { status: 500 }
    )
  }
}
