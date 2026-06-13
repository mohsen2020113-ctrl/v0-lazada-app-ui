import { createClient } from '@supabase/supabase-js'
import { fetchAllProducts } from '@/lib/shopify'
import DashboardUI from './dashboard-ui'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [
    { data: recentOrders },
    { data: allOrders },
    { data: lowStock },
    { data: profilesCount },
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('id, status, total, currency, shipping_address, created_at, payment_method')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('orders')
      .select('total, currency, shipping_address, status, created_at'),
    supabase
      .from('inventory')
      .select('product_id, sku, quantity, available_quantity, low_stock_threshold, warehouse_location')
      .filter('available_quantity', 'lte', 10)
      .order('available_quantity', { ascending: true })
      .limit(10),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true }),
  ])

  const totalOrders = allOrders?.length ?? 0
  const totalSales = allOrders?.reduce((sum, o) => sum + parseFloat(String(o.total ?? 0)), 0) ?? 0
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

  const countryMap: Record<string, number> = {}
  allOrders?.forEach(o => {
    const addr = o.shipping_address as Record<string, string> | null
    const country = addr?.country ?? addr?.country_code ?? 'غير محدد'
    if (country) countryMap[country] = (countryMap[country] || 0) + 1
  })
  const topCountries = Object.entries(countryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, orders]) => ({ name, orders }))

  let shopifyProductsCount = 0
  try {
    const result = await fetchAllProducts('ae')
    shopifyProductsCount = result.products.length
  } catch {}

  return {
    recentOrders: recentOrders ?? [],
    kpis: {
      totalOrders,
      totalSales,
      avgOrderValue,
      shopifyProductsCount,
      registeredUsers: (profilesCount as any)?.count ?? 0,
    },
    topCountries,
    lowStock: lowStock ?? [],
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  return <DashboardUI data={data} />
}
