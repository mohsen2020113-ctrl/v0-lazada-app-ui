import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ items: [] })

  const { data } = await supabaseAdmin.from('wishlists').select('*').eq('user_id', userId)
  return NextResponse.json({ items: data || [] })
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabaseAdmin
    .from('wishlists')
    .upsert({ user_id: userId, ...body }, { onConflict: 'user_id,shopify_product_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ item: data })
}

export async function DELETE(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  const { productId } = await req.json()

  await supabaseAdmin.from('wishlists').delete().eq('user_id', userId).eq('shopify_product_id', productId)
  return NextResponse.json({ success: true })
}
