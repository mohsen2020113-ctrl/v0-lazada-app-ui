-- ============================================================
-- LEE (4leee) — Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Drop & recreate in dependency order ──────────────────────
DROP TABLE IF EXISTS public.ai_commands CASCADE;
DROP TABLE IF EXISTS public.search_history CASCADE;
DROP TABLE IF EXISTS public.wishlist CASCADE;
DROP TABLE IF EXISTS public.cart CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.inventory CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ── profiles (canonical user table) ──────────────────────────
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  email         TEXT UNIQUE,
  avatar_url    TEXT,
  phone         TEXT,
  country       TEXT DEFAULT 'AE',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

-- ── orders ────────────────────────────────────────────────────
CREATE TABLE public.orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shopify_id      TEXT UNIQUE,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled','refunded')),
  total_amount    NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency        TEXT NOT NULL DEFAULT 'AED',
  items           JSONB NOT NULL DEFAULT '[]',
  shipping_addr   JSONB,
  payment_method  TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status  ON public.orders(status);

-- ── order_items ───────────────────────────────────────────────
CREATE TABLE public.order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id    TEXT NOT NULL,
  variant_id    TEXT,
  title         TEXT NOT NULL,
  quantity      INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price         NUMERIC(10,2) NOT NULL,
  image_url     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- ── cart ──────────────────────────────────────────────────────
CREATE TABLE public.cart (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id    TEXT NOT NULL,
  variant_id    TEXT,
  title         TEXT NOT NULL,
  quantity      INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price         NUMERIC(10,2) NOT NULL,
  image_url     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id, variant_id)
);

CREATE TRIGGER cart_updated_at
  BEFORE UPDATE ON public.cart
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE INDEX idx_cart_user_id ON public.cart(user_id);

-- ── wishlist ──────────────────────────────────────────────────
CREATE TABLE public.wishlist (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id    TEXT NOT NULL,
  variant_id    TEXT,
  title         TEXT NOT NULL,
  price         NUMERIC(10,2),
  image_url     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX idx_wishlist_user_id ON public.wishlist(user_id);

-- ── inventory ─────────────────────────────────────────────────
CREATE TABLE public.inventory (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopify_product_id  TEXT UNIQUE NOT NULL,
  shopify_variant_id  TEXT,
  title               TEXT NOT NULL,
  available_quantity  INT NOT NULL DEFAULT 0 CHECK (available_quantity >= 0),
  reserved_quantity   INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── reviews ───────────────────────────────────────────────────
CREATE TABLE public.reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id    TEXT NOT NULL,
  rating        SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title         TEXT,
  body          TEXT,
  verified      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);

-- ── search_history ────────────────────────────────────────────
CREATE TABLE public.search_history (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  query         TEXT NOT NULL,
  result_count  INT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);

-- ── ai_commands (LEE AI assistant) ───────────────────────────
CREATE TABLE public.ai_commands (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  command_text    TEXT NOT NULL,
  response_text   TEXT,
  model           TEXT DEFAULT 'claude-3-haiku',
  tokens_used     INT,
  duration_ms     INT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_commands_user_id ON public.ai_commands(user_id);
CREATE INDEX idx_ai_commands_created_at ON public.ai_commands(created_at);

-- ═══════════════════════════════════════════════════════════════
-- ROW-LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_commands  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory    ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders"
  ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- order_items
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "Users can insert own order items"
  ON public.order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));

-- cart
CREATE POLICY "Users can view own cart"
  ON public.cart FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert into own cart"
  ON public.cart FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart"
  ON public.cart FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from own cart"
  ON public.cart FOR DELETE USING (auth.uid() = user_id);

-- wishlist
CREATE POLICY "Users can view own wishlist"
  ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert into own wishlist"
  ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete from own wishlist"
  ON public.wishlist FOR DELETE USING (auth.uid() = user_id);

-- reviews
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert own reviews"
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- search_history
CREATE POLICY "Users can view own search history"
  ON public.search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own search history"
  ON public.search_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own search history"
  ON public.search_history FOR DELETE USING (auth.uid() = user_id);

-- ai_commands
CREATE POLICY "Users can view own ai commands"
  ON public.ai_commands FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ai commands"
  ON public.ai_commands FOR INSERT WITH CHECK (auth.uid() = user_id);

-- inventory — public read, no client writes
CREATE POLICY "Anyone can view inventory"
  ON public.inventory FOR SELECT USING (TRUE);
