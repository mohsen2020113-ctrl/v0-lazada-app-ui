# 4LEEE Database Documentation Index

## 📚 Quick Navigation

### Getting Started (Start Here!)
- **[README_SUPABASE.md](README_SUPABASE.md)** - 5-minute quick start guide
  - How to run migrations (Dashboard, CLI, psql)
  - Environment setup
  - Common operations with code examples
  - Troubleshooting guide

### Migration Files (Ready to Execute)
- **[supabase/migrations/001_create_schema.sql](supabase/migrations/001_create_schema.sql)** - Schema creation
  - 13 tables with relationships
  - 20+ performance indexes
  - Row Level Security (RLS) policies
  - ~340 lines of SQL

- **[supabase/migrations/002_insert_initial_data.sql](supabase/migrations/002_insert_initial_data.sql)** - Sample data
  - 14 product categories
  - 15 sample products
  - 11 product variants
  - ~100 lines of SQL

### Detailed Documentation
- **[SUPABASE_SQL_MIGRATION.md](SUPABASE_SQL_MIGRATION.md)** - Complete migration guide
  - Step-by-step instructions for all methods
  - Schema verification queries
  - Backup and export procedures
  - Advanced topics (FTS, materialized views)

- **[SUPABASE_QUERIES.md](SUPABASE_QUERIES.md)** - SQL query reference
  - 50+ common queries
  - Categories, products, reviews, orders
  - Cart, wishlist, user management
  - Analytics and maintenance queries

### Helper Scripts
- **[scripts/run-migrations.sh](scripts/run-migrations.sh)** - Interactive migration tool
  - Choose between Dashboard, psql, or CLI
  - Automatic migration execution
  - Guided setup

## 📊 Database Overview

### 13 Tables Created

#### User Management
- **users** - User accounts and profiles
- **sessions** - Active user sessions
- **addresses** - Shipping and billing addresses
- **search_history** - User search queries

#### Products & Catalog
- **categories** - Product categories (14 pre-loaded)
- **products** - Product listings (15 pre-loaded)
- **product_variants** - Sizes, colors, variants (11 pre-loaded)
- **reviews** - Product reviews and ratings

#### Shopping Experience
- **carts** - Shopping carts
- **cart_items** - Items in carts
- **wishlists** - Saved products
- **orders** - Purchase orders
- **order_items** - Items in orders

### 20+ Performance Indexes

Optimized for quick queries on:
- Product searches: `handle`, `category_id`, `shopify_id`
- User queries: `email`, `user_id`
- Order lookups: `order_number`, `shopify_order_id`
- Date ranges: `created_at` (DESC)

### Row Level Security (RLS)

✅ **Public Access**
- Categories
- Products
- Product variants

🔒 **User-Scoped Access**
- Orders (users see only their own)
- Carts (users see only their own)
- Wishlists (users see only their own)
- Addresses (users see only their own)

## 🚀 Quick Start (3 Steps)

### Step 1: Run Schema Migration
```bash
# Copy content of supabase/migrations/001_create_schema.sql
# Paste into Supabase SQL Editor → Run
```

### Step 2: Run Data Migration
```bash
# Copy content of supabase/migrations/002_insert_initial_data.sql
# Paste into new Supabase SQL Editor → Run
```

### Step 3: Verify
```sql
-- Run in SQL Editor to confirm
SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema='public';
-- Should show: 13
```

## 💻 Using the Database in Code

### Fetch Products
```typescript
const { data: products } = await supabase
  .from('products')
  .select('*, product_variants(*)')
  .eq('available_for_sale', true)
```

### Get User Orders
```typescript
const { data: orders } = await supabase
  .from('orders')
  .select('*, order_items(*)')
  .eq('user_id', userId)
```

### Add to Cart
```typescript
await supabase.from('cart_items').insert({
  cart_id: cartId,
  product_id: productId,
  quantity: 1,
  price: 120.00
})
```

See [README_SUPABASE.md](README_SUPABASE.md#common-operations) for more examples.

## 🔍 Query Reference

Quick reference for common operations:

| Operation | File | Queries |
|-----------|------|---------|
| Browse Products | [SUPABASE_QUERIES.md](SUPABASE_QUERIES.md#products) | Search, filter, trending |
| Manage Orders | [SUPABASE_QUERIES.md](SUPABASE_QUERIES.md#orders) | CRUD, status, revenue |
| User Reviews | [SUPABASE_QUERIES.md](SUPABASE_QUERIES.md#reviews) | Create, read, aggregate |
| Shopping Cart | [SUPABASE_QUERIES.md](SUPABASE_QUERIES.md#cart) | Add, update, remove |
| Analytics | [SUPABASE_QUERIES.md](SUPABASE_QUERIES.md#analytics-queries) | Sales, trends, insights |

## 🎯 Execution Methods

### Method 1: Supabase Dashboard (Easiest)
✅ No setup needed
✅ Visual feedback
✅ Best for beginners
👉 [Instructions](README_SUPABASE.md#for-supabase-dashboard-users-easiest)

### Method 2: Supabase CLI
✅ Automated
✅ Version controlled
✅ Best for teams
👉 [Instructions](SUPABASE_SQL_MIGRATION.md#option-2-using-supabase-cli-advanced)

### Method 3: psql
✅ Direct database access
✅ Fastest
✅ Best for experienced users
👉 [Instructions](SUPABASE_SQL_MIGRATION.md#option-3-using-psql-direct-database-connection)

## 🛠️ Troubleshooting

### Common Issues
- **"Permission denied"** → [See fix](README_SUPABASE.md#-permission-denied-error)
- **"Column does not exist"** → [See fix](README_SUPABASE.md#-column-does-not-exist-error)
- **"Foreign key constraint"** → [See fix](README_SUPABASE.md#-foreign-key-constraint-violation)

Full troubleshooting: [README_SUPABASE.md#troubleshooting](README_SUPABASE.md#troubleshooting)

## 📈 Performance Tips

1. Use indexes for custom columns
2. Select only needed columns
3. Batch operations together
4. Use pagination for large datasets
5. Monitor query performance with EXPLAIN ANALYZE

Details: [README_SUPABASE.md#performance-tips](README_SUPABASE.md#performance-tips)

## 📋 Migration Checklist

- [ ] Read [README_SUPABASE.md](README_SUPABASE.md)
- [ ] Choose execution method (Dashboard recommended)
- [ ] Run schema migration (001_create_schema.sql)
- [ ] Run data migration (002_insert_initial_data.sql)
- [ ] Verify tables created (13 total)
- [ ] Add environment variables to .env.local
- [ ] Test database connection in code
- [ ] Configure Supabase Auth (optional)
- [ ] Start building features! 🚀

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.io
- **Database Query Examples**: [SUPABASE_QUERIES.md](SUPABASE_QUERIES.md)
- **Detailed Migration Guide**: [SUPABASE_SQL_MIGRATION.md](SUPABASE_SQL_MIGRATION.md)

## 📁 File Structure

```
4LEEE Project
├── README_SUPABASE.md                    ← Start here!
├── SUPABASE_SQL_MIGRATION.md             ← Detailed guide
├── SUPABASE_QUERIES.md                   ← Query reference
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_schema.sql         ← Tables & indexes
│   │   └── 002_insert_initial_data.sql   ← Sample data
│   └── schema.sql                        ← Legacy (use migrations/)
├── scripts/
│   └── run-migrations.sh                 ← Helper tool
└── lib/
    └── supabase-schema.sql               ← Legacy reference
```

## 🎓 Learning Path

1. **New to Supabase?**
   - Start: [README_SUPABASE.md](README_SUPABASE.md)
   - Then: [SUPABASE_SQL_MIGRATION.md](SUPABASE_SQL_MIGRATION.md)

2. **Building features?**
   - Reference: [SUPABASE_QUERIES.md](SUPABASE_QUERIES.md)
   - Patterns: [README_SUPABASE.md#common-operations](README_SUPABASE.md#common-operations)

3. **Optimizing queries?**
   - Tips: [README_SUPABASE.md#performance-tips](README_SUPABASE.md#performance-tips)
   - Advanced: [SUPABASE_SQL_MIGRATION.md#advanced-topics](SUPABASE_SQL_MIGRATION.md#advanced-topics)

4. **Need help?**
   - Troubleshooting: [README_SUPABASE.md#troubleshooting](README_SUPABASE.md#troubleshooting)
   - Queries: [SUPABASE_QUERIES.md](SUPABASE_QUERIES.md)
   - Support: [README_SUPABASE.md#support-resources](README_SUPABASE.md#support-resources)

---

**Last Updated**: June 2024
**Status**: ✅ Ready to Execute
**Tables**: 13 | **Indexes**: 20+ | **Sample Records**: 40+
