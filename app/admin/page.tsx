import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { fetchAllProducts } from '@/lib/shopify'
import AdminUI from './admin-ui'

export const dynamic = 'force-dynamic'

// ── Admin auth guard ───────────────────────────────────────────────────────
async function requireAdmin() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  // Supabase stores session in a cookie named sb-<project-ref>-auth-token
  const sessionCookie = allCookies.find(
    c => (c.name.includes('auth-token') || c.name.startsWith('sb-')) && c.value
  )

  if (!sessionCookie) {
    redirect('/login?redirect=%2Fadmin')
  }

  try {
    // Cookie value may be a JSON array: [{ access_token, ... }]
    const parsed = JSON.parse(sessionCookie.value)
    const accessToken = Array.isArray(parsed)
      ? parsed[0]?.access_token
      : parsed?.access_token

    if (!accessToken) redirect('/login?redirect=%2Fadmin')

    // Verify the token with Supabase anon client
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user }, error } = await anonClient.auth.getUser(accessToken)

    if (error || !user) redirect('/login?redirect=%2Fadmin')

    // Check against ADMIN_EMAILS env var (comma-separated list)
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim())
      .filter(Boolean)

    if (adminEmails.length > 0 && !adminEmails.includes(user.email ?? '')) {
      redirect('/?error=unauthorized')
    }

    return user
  } catch {
    redirect('/login?redirect=%2Fadmin')
  }
}

// ── Data fetcher (uses service role — runs only after auth is verified) ─────
async function getAdminData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const [
    { data: orders },
    { data: profiles },
    { data: inventory },
  ] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50),
    supabase.from('profiles').select('id, full_name, email, created_at, avatar_url').order('created_at', { ascending: false }).limit(50),
    supabase.from('inventory').select('*').order('available_quantity', { ascending: true }).limit(50),
  ])

  let products: any[] = []
  try {
    const result = await fetchAllProducts('ae')
    products = result.products
  } catch {}

  return {
    orders: orders ?? [],
    profiles: profiles ?? [],
    inventory: inventory ?? [],
    products,
  }
}

export default async function AdminPage() {
  await requireAdmin()
  await getAdminData()
  return <AdminUI />
}
