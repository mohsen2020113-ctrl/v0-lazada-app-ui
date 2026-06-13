import { createClient } from '@supabase/supabase-js'
import { fetchAllProducts } from '@/lib/shopify'
import AdminUI from './admin-ui'

export const dynamic = 'force-dynamic'

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
  
  return { orders: orders ?? [], profiles: profiles ?? [], inventory: inventory ?? [], products }
}

export default async function AdminPage() {
  const data = await getAdminData()
  return <AdminUI data={data} />
}
