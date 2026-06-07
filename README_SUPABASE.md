# 4LEEE Database Setup & SQL Migration Guide

## Quick Start (5 Minutes)

### For Supabase Dashboard Users (Easiest)

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your 4LEEE project

2. **Run Schema Migration**
   - Click **SQL Editor** → **New Query**
   - Open `supabase/migrations/001_create_schema.sql` in your editor
   - Copy the entire file content
   - Paste into Supabase SQL Editor
   - Click **Run** (Cmd/Ctrl + Enter)
   - Wait for green checkmark ✅

3. **Run Data Migration**
   - Click **New Query** again
   - Open `supabase/migrations/002_insert_initial_data.sql`
   - Copy and paste into new query window
   - Click **Run**
   - Wait for completion ✅

4. **Verify**
   - Click **Table Editor** in left sidebar
   - You should see 13 tables created
   - Click on products table → should see 15 sample products

### For CLI Users

```bash
# Install migration script
chmod +x scripts/run-migrations.sh

# Run interactive migration tool
./scripts/run-migrations.sh

# Follow the prompts
```

### For psql Users

```bash
# Get your connection string from Supabase:
# Settings → Database → Connection string → URI

psql "postgresql://[user]:[password]@[host]:5432/[db]" \
  -f supabase/migrations/001_create_schema.sql

psql "postgresql://[user]:[password]@[host]:5432/[db]" \
  -f supabase/migrations/002_insert_initial_data.sql
```

## What Gets Created

### Tables (13 Total)

| Table | Purpose | Records |
|-------|---------|---------|
| **users** | User accounts | 0 (populated by auth) |
| **sessions** | Active sessions | 0 (auto-populated) |
| **categories** | Product categories | 14 |
| **products** | Product listings | 15 |
| **product_variants** | Product sizes, colors | 11 |
| **reviews** | Product reviews | 0 (user-generated) |
| **orders** | Purchase orders | 0 (transaction data) |
| **order_items** | Items in orders | 0 (transaction data) |
| **carts** | Shopping carts | 0 (session data) |
| **cart_items** | Items in carts | 0 (session data) |
| **wishlists** | Saved items | 0 (user-generated) |
| **addresses** | Shipping addresses | 0 (user data) |
| **search_history** | Search queries | 0 (auto-populated) |

### Indexes (20+)

Performance indexes on frequently queried columns:
- Product searches: `handle`, `category_id`, `shopify_id`
- User queries: `email`, `user_id`
- Order lookups: `order_number`, `shopify_order_id`
- Date filters: `created_at` DESC

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- ✅ Public tables: categories, products, product_variants
- 🔒 Protected tables: orders, carts, wishlists (user-scoped)
- 🔓 Admin tables: None (use service role key)

## Database Schema Relationships

```
USERS (Core)
├── SESSIONS (1:M)
├── ORDERS (1:M)
├── REVIEWS (1:M)
├── WISHLISTS (1:M)
├── ADDRESSES (1:M)
├── CARTS (1:M)
└── SEARCH_HISTORY (1:M)

CATEGORIES
└── PRODUCTS (1:M)

PRODUCTS
├── PRODUCT_VARIANTS (1:M)
├── REVIEWS (1:M)
├── CART_ITEMS (1:M)
├── WISHLISTS (1:M)
└── ORDER_ITEMS (1:M)

CARTS
└── CART_ITEMS (1:M)

ORDERS
└── ORDER_ITEMS (1:M)
```

## Environment Setup

### 1. Get Credentials

In Supabase Dashboard:
- **Settings** → **API** → Copy:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### 2. Add to `.env.local`

```env
# Public keys (safe to expose)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...xxx

# Secret keys (NEVER expose)
SUPABASE_SERVICE_ROLE_KEY=eyJ...xxx
```

### 3. Initialize Supabase Client

```typescript
import { createClient } from '@supabase/supabase-js'

// Client-side (respects RLS policies)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-side (bypasses RLS with service role)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

## Common Operations

### Fetch Products

```typescript
// Get all products
const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .eq('available_for_sale', true)
  .order('created_at', { ascending: false })
  .limit(50)

// Get single product with variants
const { data: product, error } = await supabase
  .from('products')
  .select(`
    *,
    product_variants(id, title, price)
  `)
  .eq('handle', 'wireless-headphones')
  .single()
```

### Create Order

```typescript
// Create order (server-side with service role)
const { data: order, error } = await supabaseAdmin
  .from('orders')
  .insert({
    user_id: userId,
    order_number: `ORD-${Date.now()}`,
    subtotal: 450,
    tax: 22.50,
    shipping: 25,
    total: 497.50,
    currency: 'AED',
    country_code: 'AE',
    status: 'pending'
  })
  .select()
  .single()
```

### Add to Cart

```typescript
const { data, error } = await supabase
  .from('cart_items')
  .insert({
    cart_id: cartId,
    product_id: productId,
    product_title: 'Wireless Headphones',
    price: 120.00,
    quantity: 1
  })
  .select()
```

### Get User Orders

```typescript
const { data: orders, error } = await supabase
  .from('orders')
  .select(`
    *,
    order_items(
      id,
      product_id,
      product_name_snapshot,
      quantity,
      price_snapshot
    )
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

## Troubleshooting

### ❌ "Permission denied" Error

**Cause**: RLS policies preventing access

**Solution**:
- For user data: Ensure user is authenticated with correct auth.uid()
- For admin operations: Use service role key with `supabaseAdmin`
- Check RLS policies: **Settings** → **Policies**

### ❌ "Column does not exist" Error

**Cause**: Schema not created properly

**Solution**:
1. Run migration 001 again
2. Verify table exists in Table Editor
3. Check column names match queries exactly

### ❌ "Foreign key constraint violation"

**Cause**: Referencing non-existent record

**Solution**:
- Verify parent record exists before inserting
- Example: `product_id` must exist in `products` table first

### ❌ "UNIQUE constraint violation"

**Cause**: Duplicate value in unique column

**Solution**:
- Check existing data: `SELECT * FROM table WHERE column = value;`
- Handle conflicts: `ON CONFLICT DO NOTHING` or `DO UPDATE SET`

### ✅ Verify Everything Works

```sql
-- Run these in SQL Editor
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_categories FROM categories;
SELECT * FROM categories LIMIT 5;
SELECT p.title, COUNT(pv.id) as variant_count 
FROM products p 
LEFT JOIN product_variants pv ON p.id = pv.product_id 
GROUP BY p.id, p.title;
```

Expected results:
- 15 products
- 14 categories
- 11 product variants

## Performance Tips

### 1. Add Indexes for Custom Queries

```sql
-- For frequently filtered columns
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
```

### 2. Use SELECT() to Limit Columns

```typescript
// ✅ Better - Only fetch needed columns
const { data } = await supabase
  .from('products')
  .select('id, title, price')

// ❌ Slower - Fetches all columns
const { data } = await supabase
  .from('products')
  .select('*')
```

### 3. Batch Operations

```typescript
// ✅ Better - Single batch
const { data } = await supabase
  .from('cart_items')
  .insert(items) // Array of items

// ❌ Slower - Multiple requests
for (let item of items) {
  await supabase.from('cart_items').insert(item)
}
```

### 4. Use Pagination

```typescript
// ✅ Better - Paginated
const { data } = await supabase
  .from('products')
  .select('*')
  .range(0, 49)

// ❌ Slower - All records
const { data } = await supabase
  .from('products')
  .select('*')
```

## Advanced Topics

### Real-time Subscriptions

```typescript
// Subscribe to product changes
supabase
  .from('products')
  .on('*', payload => {
    console.log('Change received!', payload)
  })
  .subscribe()
```

### Full-Text Search

```typescript
// Search products by title and description
const { data } = await supabase
  .from('products')
  .select('*')
  .textSearch('fts', 'wireless headphones')
```

### Aggregations

```typescript
// Get product ratings
const { data } = await supabase
  .from('reviews')
  .select('product_id, rating')
  .eq('product_id', productId)

// Calculate average
const avgRating = data?.reduce((sum, r) => sum + r.rating, 0) / data?.length
```

## Related Files

- 📄 `supabase/migrations/001_create_schema.sql` - Schema definition
- 📄 `supabase/migrations/002_insert_initial_data.sql` - Sample data
- 📄 `SUPABASE_QUERIES.md` - 50+ SQL query examples
- 📄 `SUPABASE_SQL_MIGRATION.md` - Detailed migration guide
- 📄 `scripts/run-migrations.sh` - Migration helper script

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Discord Community**: https://discord.supabase.io
- **GitHub Issues**: https://github.com/supabase/supabase/issues

## Next Steps

1. ✅ Run migrations (schema + data)
2. ✅ Verify tables created
3. ✅ Add environment variables
4. ✅ Test database connection
5. ✅ Configure authentication
6. ✅ Build app features

Happy coding! 🚀
