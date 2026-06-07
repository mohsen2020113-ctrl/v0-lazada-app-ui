<!-- truncated -->

# Supabase SQL Migration Guide

## Overview

This guide explains how to execute the SQL migrations for the 4LEEE e-commerce platform in Supabase.

## Files

Two migration files have been created in `supabase/migrations/`:

1. **001_create_schema.sql** - Creates all tables, indexes, and Row Level Security (RLS) policies
2. **002_insert_initial_data.sql** - Populates the database with initial categories, products, and variants

## Prerequisites

- Supabase project created and accessible at https://supabase.com
- Admin access to the Supabase dashboard
- Database connection credentials (if running locally)

## How to Execute Migrations

### Option 1: Using Supabase Dashboard (Recommended)

#### Step 1: Open SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query** or select an existing query editor

#### Step 2: Execute Schema Migration (001_create_schema.sql)

1. Open `supabase/migrations/001_create_schema.sql` from the project
2. Copy the entire SQL content
3. Paste it into the Supabase SQL editor
4. Click the **Run** button (or press Cmd+Enter on Mac, Ctrl+Enter on Windows/Linux)
5. Wait for the execution to complete
6. You should see success messages for each table creation

**What's Created:**
- 13 tables with proper relationships and constraints
- 20+ indexes for query performance
- Row Level Security (RLS) policies for all tables
- Automatic timestamp columns (created_at, updated_at)

#### Step 3: Execute Data Migration (002_insert_initial_data.sql)

1. Open `supabase/migrations/002_insert_initial_data.sql`
2. Copy the entire SQL content
3. Paste it into a new SQL query window
4. Click **Run**
5. Verify the data was inserted successfully

**What's Inserted:**
- 14 product categories (Fashion, Electronics, Gaming, etc.)
- 15 sample products with images and pricing
- Product variants (sizes, colors)
- All with realistic 4LEEE marketplace data

### Option 2: Using Supabase CLI (Advanced)

If you have the Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Verify migrations ran
supabase db pull
```

### Option 3: Using psql (Direct Database Connection)

If you have PostgreSQL client installed:

```bash
# Get your database connection string from Supabase Dashboard:
# Settings → Database → Connection string → URI

# Connect to database
psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Run schema migration
\i supabase/migrations/001_create_schema.sql

# Run data migration
\i supabase/migrations/002_insert_initial_data.sql
```

## Verifying the Schema

After executing the migrations, verify everything was created correctly:

### Using Supabase Dashboard

1. Click **Table Editor** in the left sidebar
2. You should see these tables:
   - users
   - sessions
   - categories
   - products
   - product_variants
   - reviews
   - orders
   - order_items
   - carts
   - cart_items
   - wishlists
   - addresses
   - search_history

### Using SQL Query

```sql
-- List all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Count rows in each table
SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'product_variants', COUNT(*) FROM product_variants;
```

## Table Relationships

```
users (1) ──────→ (∞) sessions
users (1) ──────→ (∞) orders
users (1) ──────→ (∞) reviews
users (1) ──────→ (∞) wishlists
users (1) ──────→ (∞) addresses
users (1) ──────→ (∞) carts
users (1) ──────→ (∞) search_history

categories (1) ──→ (∞) products
products (1) ──→ (∞) product_variants
products (1) ──→ (∞) reviews
products (1) ──→ (∞) cart_items
products (1) ──→ (∞) wishlists
products (1) ──→ (∞) order_items

carts (1) ──────→ (∞) cart_items
orders (1) ─────→ (∞) order_items
```

## Row Level Security (RLS) Policies

All tables have RLS enabled with the following policies:

### Public Tables (Anyone can read)
- **categories** - Public read access
- **products** - Public read access
- **product_variants** - Public read access

### User-Protected Tables
- **users** - Users can read profiles, update only their own
- **reviews** - Public read, authenticated users can create/update/delete their own
- **orders** - Users can only read/create their own orders
- **order_items** - Users can only read items from their own orders
- **carts** - Users can only manage their own carts
- **cart_items** - Users can only manage items in their own carts
- **wishlists** - Users can only manage their own wishlists
- **addresses** - Users can only manage their own addresses
- **search_history** - Users can only manage their own search history
- **sessions** - Users can only read/create their own sessions

To enable authentication in your app, configure Supabase Auth in your project.

## Troubleshooting

### Issue: "Permission denied" error

**Solution**: Ensure you're logged in as an admin or database owner in Supabase Dashboard. RLS policies might be causing issues if auth is not properly configured.

### Issue: "Duplicate key value violates unique constraint"

**Solution**: Check if migrations were already run. You can safely run the schema migration again as it uses `IF NOT EXISTS` clauses.

### Issue: Foreign key constraint violation

**Solution**: Ensure migrations are run in order (001 before 002). The schema must be created before inserting data.

### Issue: Columns missing or wrong type

**Solution**: Delete all tables manually and run migrations again, or use `DROP TABLE IF EXISTS ... CASCADE;` to clean up.

## Modifying the Schema

To modify the schema after initial creation:

1. Create a new migration file: `supabase/migrations/003_add_new_table.sql`
2. Write your SQL changes
3. Execute through Supabase SQL Editor
4. Document the changes in this file

### Example: Adding a new column

```sql
ALTER TABLE products ADD COLUMN new_column_name VARCHAR(255);
CREATE INDEX idx_products_new_column ON products(new_column_name);
```

## Backup & Export

### Backup Data

1. Go to **Settings** → **Backups** in Supabase Dashboard
2. Click **Request backup** or let auto-backups run
3. Download backups when needed

### Export Data

```sql
-- Export products as CSV
COPY products TO STDOUT WITH CSV HEADER;

-- Export as JSON
SELECT json_agg(row_to_json(t)) FROM products t;
```

## Performance Tuning

All tables have indexes on frequently queried columns:

- **products**: indexed on handle, category_id, shopify_id
- **reviews**: indexed on product_id, user_id, created_at
- **orders**: indexed on user_id, order_number, shopify_order_id
- **cart_items**: indexed on cart_id, product_id
- **wishlists**: indexed on user_id, product_id

Add more indexes if you notice slow queries:

```sql
-- Create index for common filter
CREATE INDEX idx_table_column ON table_name(column_name);

-- Monitor query performance
EXPLAIN ANALYZE SELECT * FROM products WHERE category_id = 1;
```

## Integration with Application

### Environment Variables

Your `.env.local` should have:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Using the Tables in Code

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Fetch products
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category_id', 1)

// Create order
const { data, error } = await supabase
  .from('orders')
  .insert([{
    user_id: userId,
    order_number: 'ORD-123',
    total: 500,
    currency: 'AED'
  }])
```

## Advanced Topics

### Full-Text Search

Add search capability to products:

```sql
-- Create search index
CREATE INDEX idx_products_search ON products USING GIN (to_tsvector('english', title || ' ' || description));

-- Search query
SELECT * FROM products WHERE to_tsvector('english', title || ' ' || description) @@ plainto_tsquery('english', 'wireless headphones');
```

### Materialized Views

Create pre-calculated views for reporting:

```sql
CREATE MATERIALIZED VIEW product_sales AS
SELECT 
  p.id,
  p.title,
  COUNT(oi.id) as total_sales,
  SUM(oi.price_snapshot * oi.quantity) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.title;

REFRESH MATERIALIZED VIEW product_sales;
```

## Related Documentation

- Supabase Documentation: https://supabase.com/docs
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Row Level Security Guide: https://supabase.com/docs/guides/auth/row-level-security
- Database Functions: https://supabase.com/docs/guides/database/functions

## Support

For issues with SQL migrations:

1. Check Supabase Status: https://status.supabase.com
2. Review SQL error messages in the dashboard
3. Check database logs: **Settings** → **Logs**
4. Contact Supabase Support or post in Discord community
