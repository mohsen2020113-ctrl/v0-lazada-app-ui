# Common Supabase Queries for 4LEEE

Quick reference for frequently used SQL queries in the 4LEEE application.

## Categories

### Get all categories
```sql
SELECT * FROM categories ORDER BY sort_order ASC;
```

### Get subcategories
```sql
SELECT * FROM categories WHERE parent_id IS NULL ORDER BY sort_order;
SELECT * FROM categories WHERE parent_id = 1 ORDER BY sort_order;
```

### Get category by slug
```sql
SELECT * FROM categories WHERE slug = 'electronics';
```

## Products

### Get all products
```sql
SELECT * FROM products ORDER BY created_at DESC LIMIT 50;
```

### Get products by category
```sql
SELECT * FROM products 
WHERE category_id = 1 
ORDER BY created_at DESC;
```

### Get trending products
```sql
SELECT * FROM products 
WHERE is_trending = TRUE 
ORDER BY rating DESC 
LIMIT 20;
```

### Get new products
```sql
SELECT * FROM products 
WHERE is_new = TRUE 
ORDER BY created_at DESC 
LIMIT 20;
```

### Search products
```sql
SELECT * FROM products 
WHERE title ILIKE '%wireless%' 
   OR description ILIKE '%wireless%'
ORDER BY rating DESC;
```

### Get product with variants
```sql
SELECT 
  p.id, p.title, p.price, p.original_price,
  json_agg(json_build_object(
    'id', pv.id,
    'title', pv.title,
    'price', pv.price
  )) as variants
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 1
GROUP BY p.id, p.title, p.price, p.original_price;
```

### Get products with discount
```sql
SELECT * FROM products 
WHERE original_price > price 
ORDER BY discount_percentage DESC;
```

### Update product stock
```sql
UPDATE products 
SET stock_quantity = stock_quantity - 1 
WHERE id = 1;
```

## Reviews

### Get product reviews
```sql
SELECT 
  r.id, r.rating, r.title, r.text,
  u.full_name, r.created_at
FROM reviews r
LEFT JOIN users u ON r.user_id = u.id
WHERE r.product_id = 1
ORDER BY r.created_at DESC;
```

### Get product rating summary
```sql
SELECT 
  product_id,
  ROUND(AVG(rating)::numeric, 2) as avg_rating,
  COUNT(*) as review_count,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
FROM reviews
WHERE product_id = 1
GROUP BY product_id;
```

### Get verified reviews
```sql
SELECT * FROM reviews 
WHERE product_id = 1 
AND verified_purchase = TRUE
ORDER BY helpful_count DESC;
```

### Create review
```sql
INSERT INTO reviews (user_id, product_id, rating, text, title)
VALUES ('user-uuid', 1, 5, 'Great product!', 'Excellent');
```

## Orders

### Get user orders
```sql
SELECT * FROM orders 
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC;
```

### Get order with items
```sql
SELECT 
  o.id, o.order_number, o.total, o.status,
  json_agg(json_build_object(
    'product_id', oi.product_id,
    'quantity', oi.quantity,
    'price', oi.price_snapshot
  )) as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.id = 1
GROUP BY o.id;
```

### Get pending orders
```sql
SELECT * FROM orders 
WHERE status = 'pending'
ORDER BY created_at ASC;
```

### Update order status
```sql
UPDATE orders 
SET status = 'fulfilled', updated_at = NOW()
WHERE id = 1;
```

### Get orders by date range
```sql
SELECT * FROM orders
WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31'
ORDER BY created_at DESC;
```

### Total revenue by month
```sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as order_count,
  SUM(total) as total_revenue,
  AVG(total) as avg_order_value
FROM orders
WHERE status = 'paid'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

## Cart

### Get user cart
```sql
SELECT * FROM carts 
WHERE user_id = 'user-uuid' 
LIMIT 1;
```

### Get cart items
```sql
SELECT 
  ci.id, ci.product_title, ci.quantity, ci.price,
  ci.price * ci.quantity as subtotal
FROM cart_items ci
WHERE ci.cart_id = 'cart-uuid'
ORDER BY ci.created_at;
```

### Calculate cart total
```sql
SELECT 
  SUM(price * quantity) as total,
  COUNT(*) as item_count
FROM cart_items
WHERE cart_id = 'cart-uuid';
```

### Add to cart
```sql
INSERT INTO cart_items (cart_id, product_id, product_title, price, quantity)
VALUES ('cart-uuid', 1, 'Product Name', 45.00, 1)
ON CONFLICT (cart_id, product_id) 
DO UPDATE SET quantity = quantity + 1;
```

### Remove from cart
```sql
DELETE FROM cart_items 
WHERE id = 'item-uuid';
```

## Wishlist

### Get user wishlist
```sql
SELECT 
  w.id, p.title, p.price, p.image_url,
  w.added_at
FROM wishlists w
JOIN products p ON w.product_id = p.id
WHERE w.user_id = 'user-uuid'
ORDER BY w.added_at DESC;
```

### Add to wishlist
```sql
INSERT INTO wishlists (user_id, product_id, shopify_product_id, product_title, price)
VALUES ('user-uuid', 1, 'shopify-id', 'Product', 45.00)
ON CONFLICT (user_id, product_id) DO NOTHING;
```

### Remove from wishlist
```sql
DELETE FROM wishlists 
WHERE user_id = 'user-uuid' AND product_id = 1;
```

### Check if product in wishlist
```sql
SELECT EXISTS(
  SELECT 1 FROM wishlists 
  WHERE user_id = 'user-uuid' AND product_id = 1
) as in_wishlist;
```

## Users & Addresses

### Get user profile
```sql
SELECT id, email, full_name, country_code, language
FROM users 
WHERE id = 'user-uuid';
```

### Update user profile
```sql
UPDATE users 
SET full_name = 'John Doe', phone = '1234567890'
WHERE id = 'user-uuid';
```

### Get user addresses
```sql
SELECT * FROM addresses 
WHERE user_id = 'user-uuid'
ORDER BY is_default DESC, created_at DESC;
```

### Add address
```sql
INSERT INTO addresses (user_id, first_name, last_name, address1, city, country_code, zip, phone)
VALUES ('user-uuid', 'John', 'Doe', '123 Main St', 'Dubai', 'AE', '12345', '+971501234567');
```

### Set default address
```sql
UPDATE addresses SET is_default = FALSE WHERE user_id = 'user-uuid';
UPDATE addresses SET is_default = TRUE WHERE id = 'address-uuid';
```

## Search History

### Get user search history
```sql
SELECT DISTINCT query 
FROM search_history
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC
LIMIT 10;
```

### Add search query
```sql
INSERT INTO search_history (user_id, query)
VALUES ('user-uuid', 'wireless headphones');
```

### Get trending searches
```sql
SELECT 
  query,
  COUNT(*) as search_count
FROM search_history
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY query
ORDER BY search_count DESC
LIMIT 20;
```

## Analytics Queries

### Best selling products
```sql
SELECT 
  p.id, p.title, 
  SUM(oi.quantity) as total_quantity,
  SUM(oi.price_snapshot * oi.quantity) as total_revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.id, p.title
ORDER BY total_quantity DESC
LIMIT 10;
```

### Customer purchase frequency
```sql
SELECT 
  u.id, u.full_name, u.email,
  COUNT(o.id) as purchase_count,
  SUM(o.total) as total_spent,
  MAX(o.created_at) as last_purchase
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.full_name, u.email
ORDER BY purchase_count DESC;
```

### Product performance by category
```sql
SELECT 
  c.name,
  COUNT(DISTINCT p.id) as product_count,
  COUNT(DISTINCT o.id) as orders,
  ROUND(AVG(p.rating)::numeric, 2) as avg_rating
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
GROUP BY c.id, c.name
ORDER BY orders DESC;
```

## Maintenance Queries

### Check table sizes
```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
```

### List all indexes
```sql
SELECT 
  schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### Vacuum and analyze (maintenance)
```sql
VACUUM ANALYZE;
```

## Notes

- Replace `'user-uuid'` with actual user IDs
- Replace `'cart-uuid'` with actual cart IDs
- All timestamps are in UTC (TIMESTAMPTZ)
- Modify LIMIT values as needed for pagination
- Use OFFSET for pagination: `LIMIT 10 OFFSET 20`
