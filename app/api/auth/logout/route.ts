import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get('lee_session')?.value

    if (session) {
      // Delete session from database
      await supabaseAdmin
        .from('sessions')
        .delete()
        .eq('token', session)
    }

    // Create response with cleared cookies
    const response = NextResponse.json({
      message: 'Logged out successfully',
    })

    response.cookies.delete('lee_session')
    return response
  } catch (error) {
    console.error('[v0] Logout error:', error)
    return NextResponse.json(
      { error: 'Logout error occurred' },
      { status: 500 }
    )
  }
}
