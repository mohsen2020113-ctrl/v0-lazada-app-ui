-- 4LEEE Database Schema for Supabase
-- This migration creates all necessary tables for the 4LEEE e-commerce platform

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  country_code TEXT DEFAULT 'AE',
  language TEXT DEFAULT 'ar',
  shopify_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_country_code ON users(country_code);

-- ============================================================================
-- SESSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  country_code TEXT DEFAULT 'AE',
  device_type TEXT,
  ip_address TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);

-- ============================================================================
-- CATEGORIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  parent_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
  icon TEXT,
  description TEXT,
  level INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- ============================================================================
-- PRODUCTS & VARIANTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  shopify_id VARCHAR(255) UNIQUE,
  title VARCHAR(500) NOT NULL,
  handle VARCHAR(500) NOT NULL UNIQUE,
  description TEXT,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(12,2) NOT NULL,
  original_price DECIMAL(12,2),
  discount_percentage INT,
  stock_quantity INT DEFAULT 0,
  sku VARCHAR(100),
  image_url TEXT,
  images JSONB,
  brand VARCHAR(255),
  attributes JSONB,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  is_new BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  available_for_sale BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(handle);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_shopify_id ON products(shopify_id);

CREATE TABLE IF NOT EXISTS product_variants (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(12,2),
  sku VARCHAR(100),
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);

-- ============================================================================
-- REVIEWS & RATINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(255),
  text TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  images JSONB,
  helpful_count INT DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- ============================================================================
-- ORDERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  shopify_order_id TEXT,
  shopify_order_number TEXT,
  checkout_payment_id TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(12,2) NOT NULL,
  tax DECIMAL(12,2) DEFAULT 0,
  shipping DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'AED',
  country_code TEXT DEFAULT 'AE',
  shipping_address JSONB,
  payment_method VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_shopify_order_id ON orders(shopify_order_id);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE RESTRICT,
  product_name_snapshot VARCHAR(500) NOT NULL,
  price_snapshot DECIMAL(12,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  variant_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================================================
-- CART
-- ============================================================================

CREATE TABLE IF NOT EXISTS carts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_token TEXT,
  country_code TEXT DEFAULT 'AE',
  currency TEXT DEFAULT 'AED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_token ON carts(session_token);

CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  shopify_product_id TEXT,
  shopify_variant_id TEXT,
  product_title VARCHAR(500) NOT NULL,
  variant_title TEXT,
  price DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'AED',
  quantity INT NOT NULL DEFAULT 1,
  image_url TEXT,
  product_handle TEXT,
  variant_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- ============================================================================
-- WISHLIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS wishlists (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  shopify_product_id TEXT,
  product_title VARCHAR(500),
  product_handle TEXT,
  image_url TEXT,
  price DECIMAL(12,2),
  currency TEXT DEFAULT 'AED',
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON wishlists(product_id);

-- ============================================================================
-- ADDRESSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT FALSE,
  first_name TEXT,
  last_name TEXT,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  zip TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_country_code ON addresses(country_code);

-- ============================================================================
-- SEARCH HISTORY
-- ============================================================================

CREATE TABLE IF NOT EXISTS search_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  query VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_history_user_id ON search_history(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- USERS: Users can only read public user profile info, update their own profile
CREATE POLICY "Users can read profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- SESSIONS: Users can only read/create their own sessions
CREATE POLICY "Users can read own sessions" ON sessions FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- CATEGORIES: Public read
CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);

-- PRODUCTS: Public read
CREATE POLICY "Products are public" ON products FOR SELECT USING (true);

-- PRODUCT VARIANTS: Public read
CREATE POLICY "Product variants are public" ON product_variants FOR SELECT USING (true);

-- REVIEWS: Public read, users can create/update/delete their own
CREATE POLICY "Reviews are public" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- ORDERS: Users can only read/create their own orders
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ORDER_ITEMS: Users can only read items from their own orders
CREATE POLICY "Users can read own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- CARTS: Users can only read/manage their own carts
CREATE POLICY "Users can read own carts" ON carts FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can create carts" ON carts FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own carts" ON carts FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- CART_ITEMS: Users can only manage items in their own carts
CREATE POLICY "Users can manage own cart items" ON cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.user_id IS NULL))
);

-- WISHLISTS: Users can only read/manage their own wishlists
CREATE POLICY "Users can read own wishlists" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlists" ON wishlists FOR ALL USING (auth.uid() = user_id);

-- ADDRESSES: Users can only read/manage their own addresses
CREATE POLICY "Users can read own addresses" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);

-- SEARCH_HISTORY: Users can only read/create their own search history
CREATE POLICY "Users can read own search history" ON search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create search history" ON search_history FOR INSERT WITH CHECK (auth.uid() = user_id);
