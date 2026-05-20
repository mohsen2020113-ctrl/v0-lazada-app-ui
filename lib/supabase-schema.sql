-- Users table (our own user system, separate from Shopify)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  country_code TEXT DEFAULT 'AE',
  language TEXT DEFAULT 'ar',
  shopify_customer_id TEXT, -- link to Shopify customer if needed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  country_code TEXT DEFAULT 'AE',
  device_type TEXT, -- mobile, desktop, tablet
  ip_address TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart table (our own cart, not Shopify cart)
CREATE TABLE IF NOT EXISTS carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_token TEXT, -- for guest carts
  country_code TEXT DEFAULT 'AE',
  currency TEXT DEFAULT 'AED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  shopify_product_id TEXT NOT NULL,
  shopify_variant_id TEXT NOT NULL,
  product_title TEXT NOT NULL,
  variant_title TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'AED',
  quantity INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  product_handle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table (mirrors Shopify orders + our extra data)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  shopify_order_id TEXT, -- filled after Shopify order created
  shopify_order_number TEXT,
  checkout_payment_id TEXT, -- Checkout.com payment ID
  status TEXT DEFAULT 'pending', -- pending, paid, fulfilled, cancelled
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'AED',
  country_code TEXT DEFAULT 'AE',
  shipping_address JSONB,
  line_items JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shopify_product_id TEXT NOT NULL,
  product_title TEXT,
  product_handle TEXT,
  image_url TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'AED',
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, shopify_product_id)
);

-- User addresses
CREATE TABLE IF NOT EXISTS addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT false,
  first_name TEXT,
  last_name TEXT,
  address1 TEXT,
  address2 TEXT,
  city TEXT,
  country TEXT,
  country_code TEXT,
  zip TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
