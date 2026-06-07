-- Initial Data for 4LEEE Platform
-- Run this after the main schema is created

-- ============================================================================
-- CATEGORIES - LEE Categories
-- ============================================================================

INSERT INTO categories (name, slug, parent_id, icon, description, level, sort_order) VALUES
('LEEMall', 'leemail', NULL, '🏬', 'Main marketplace category', 0, 1),
('LEELand', 'leeland', NULL, '🏞️', 'Game and entertainment space', 0, 2),
('LEEMart', 'leemart', NULL, '🛍️', 'Shopping mall category', 0, 3),
('LEELive', 'leelive', NULL, '📺', 'Live shopping and streams', 0, 4),
('Flash Sale', 'flash-sale', NULL, '⚡', 'Limited time flash deals', 0, 5),
('Fashion', 'fashion', NULL, '👔', 'Clothing, shoes, and accessories', 0, 6),
('Electronics', 'electronics', NULL, '📱', 'Tech gadgets and electronics', 0, 7),
('Mobiles', 'mobiles', NULL, '📲', 'Smartphones and mobile devices', 0, 8),
('Home & Garden', 'home-garden', NULL, '🏠', 'Home, furniture, and garden items', 0, 9),
('Gaming', 'gaming', NULL, '🎮', 'Video games and gaming accessories', 0, 10),
('Sports', 'sports', NULL, '⚽', 'Sports equipment and gear', 0, 11),
('Beauty', 'beauty', NULL, '💄', 'Beauty, skincare, and cosmetics', 0, 12),
('Food & Grocery', 'food-grocery', NULL, '🍽️', 'Food, beverages, and groceries', 0, 13),
('Vouchers', 'vouchers', NULL, '🎟️', 'Digital vouchers and gift cards', 0, 14);

-- ============================================================================
-- SAMPLE PRODUCTS - Fashion Category
-- ============================================================================

INSERT INTO products (title, handle, description, category_id, price, original_price, discount_percentage, stock_quantity, sku, image_url, is_new, is_trending, available_for_sale) VALUES
('Premium Cotton T-Shirt', 'premium-cotton-tshirt', 'High-quality 100% cotton t-shirt with comfortable fit', 6, 45.00, 60.00, 25, 150, 'TSH-001', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', true, true, true),
('Casual Denim Jeans', 'casual-denim-jeans', 'Classic blue denim jeans with perfect fit', 6, 65.00, 85.00, 24, 120, 'JNS-001', 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400', false, true, true),
('Summer Dress', 'summer-dress', 'Light and comfortable summer dress perfect for hot days', 6, 55.00, 75.00, 27, 90, 'DRS-001', 'https://images.unsplash.com/photo-1595777707802-221eca15fbb9?w=400', true, false, true),
('Casual Sneakers', 'casual-sneakers', 'Comfortable everyday sneakers in multiple colors', 6, 75.00, 100.00, 25, 100, 'SNK-001', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', false, true, true),
('Wool Winter Coat', 'wool-winter-coat', 'Warm and stylish wool coat for winter season', 6, 150.00, 200.00, 25, 60, 'COT-001', 'https://images.unsplash.com/photo-1539533057687-c8a0fc3a3ee9?w=400', false, false, true);

-- ============================================================================
-- SAMPLE PRODUCTS - Electronics Category
-- ============================================================================

INSERT INTO products (title, handle, description, category_id, price, original_price, discount_percentage, stock_quantity, sku, image_url, is_new, is_trending, available_for_sale) VALUES
('Wireless Headphones', 'wireless-headphones', 'Noise-cancelling Bluetooth headphones with 30-hour battery', 7, 120.00, 180.00, 33, 80, 'HDP-001', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', true, true, true),
('Smart Watch', 'smart-watch', 'Feature-rich smartwatch with health tracking', 7, 250.00, 350.00, 29, 50, 'SWT-001', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', true, true, true),
('USB-C Charger', 'usb-c-charger', 'Fast charging USB-C charger compatible with most devices', 7, 30.00, 45.00, 33, 200, 'CHG-001', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400', false, false, true),
('Phone Case', 'phone-case', 'Protective phone case with multiple color options', 7, 20.00, 35.00, 43, 300, 'PCS-001', 'https://images.unsplash.com/photo-1609034227505-5876f6aa4e90?w=400', false, false, true);

-- ============================================================================
-- SAMPLE PRODUCTS - Home & Garden Category
-- ============================================================================

INSERT INTO products (title, handle, description, category_id, price, original_price, discount_percentage, stock_quantity, sku, image_url, is_new, is_trending, available_for_sale) VALUES
('LED Table Lamp', 'led-table-lamp', 'Modern LED table lamp with adjustable brightness', 9, 40.00, 60.00, 33, 120, 'LMP-001', 'https://images.unsplash.com/photo-1565636192335-14375bc58be0?w=400', true, false, true),
('Coffee Maker', 'coffee-maker', 'Automatic coffee maker with programmable timer', 9, 85.00, 120.00, 29, 45, 'CFM-001', 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400', false, true, true),
('Throw Pillow', 'throw-pillow', 'Comfortable decorative throw pillow in various patterns', 9, 25.00, 40.00, 38, 200, 'PIL-001', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400', false, false, true);

-- ============================================================================
-- SAMPLE PRODUCTS - Gaming Category
-- ============================================================================

INSERT INTO products (title, handle, description, category_id, price, original_price, discount_percentage, stock_quantity, sku, image_url, is_new, is_trending, available_for_sale) VALUES
('Gaming Mouse', 'gaming-mouse', 'High-precision gaming mouse with customizable buttons', 10, 60.00, 90.00, 33, 100, 'MSE-001', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400', false, true, true),
('Mechanical Keyboard', 'mechanical-keyboard', 'RGB mechanical keyboard with Cherry MX switches', 10, 120.00, 180.00, 33, 70, 'KYB-001', 'https://images.unsplash.com/photo-1587829191301-72e0d565fff0?w=400', true, true, true),
('Gaming Headset', 'gaming-headset', '7.1 Surround sound gaming headset with microphone', 10, 95.00, 140.00, 32, 55, 'GST-001', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400', false, false, true);

-- ============================================================================
-- SAMPLE PRODUCTS - Beauty Category
-- ============================================================================

INSERT INTO products (title, handle, description, category_id, price, original_price, discount_percentage, stock_quantity, sku, image_url, is_new, is_trending, available_for_sale) VALUES
('Skincare Set', 'skincare-set', 'Complete 5-piece skincare routine set with natural ingredients', 12, 55.00, 80.00, 31, 100, 'SKN-001', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', true, true, true),
('Face Mask', 'face-mask', 'Hydrating face mask with vitamin C and collagen', 12, 20.00, 30.00, 33, 250, 'MSK-001', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', false, false, true),
('Makeup Brush Set', 'makeup-brush-set', 'Professional makeup brush set with carrying bag', 12, 35.00, 50.00, 30, 80, 'BRS-001', 'https://images.unsplash.com/photo-1596462502278-af407713571d?w=400', false, true, true);

-- ============================================================================
-- SAMPLE PRODUCTS - Sports Category
-- ============================================================================

INSERT INTO products (title, handle, description, category_id, price, original_price, discount_percentage, stock_quantity, sku, image_url, is_new, is_trending, available_for_sale) VALUES
('Yoga Mat', 'yoga-mat', 'Non-slip yoga mat with carrying strap', 11, 30.00, 50.00, 40, 150, 'YGM-001', 'https://images.unsplash.com/photo-1592432695152-f7ee7d8b97c8?w=400', false, false, true),
('Dumbbells Set', 'dumbbells-set', 'Adjustable dumbbell set 2-20kg', 11, 120.00, 180.00, 33, 40, 'DBL-001', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', true, true, true),
('Sports Water Bottle', 'sports-water-bottle', 'Insulated stainless steel water bottle 1L', 11, 25.00, 40.00, 38, 200, 'BWL-001', 'https://images.unsplash.com/photo-1602143407151-7111542de6e9?w=400', false, false, true);

-- ============================================================================
-- SAMPLE PRODUCT VARIANTS
-- ============================================================================

-- T-Shirt variants (Size: S, M, L, XL)
INSERT INTO product_variants (product_id, title, price, sku, available) 
SELECT id, 'Size S', 45.00, 'TSH-001-S', true FROM products WHERE handle = 'premium-cotton-tshirt' UNION ALL
SELECT id, 'Size M', 45.00, 'TSH-001-M', true FROM products WHERE handle = 'premium-cotton-tshirt' UNION ALL
SELECT id, 'Size L', 45.00, 'TSH-001-L', true FROM products WHERE handle = 'premium-cotton-tshirt' UNION ALL
SELECT id, 'Size XL', 45.00, 'TSH-001-XL', true FROM products WHERE handle = 'premium-cotton-tshirt';

-- Jeans variants (Size: 28, 30, 32, 34)
INSERT INTO product_variants (product_id, title, price, sku, available) 
SELECT id, 'Size 28', 65.00, 'JNS-001-28', true FROM products WHERE handle = 'casual-denim-jeans' UNION ALL
SELECT id, 'Size 30', 65.00, 'JNS-001-30', true FROM products WHERE handle = 'casual-denim-jeans' UNION ALL
SELECT id, 'Size 32', 65.00, 'JNS-001-32', true FROM products WHERE handle = 'casual-denim-jeans' UNION ALL
SELECT id, 'Size 34', 65.00, 'JNS-001-34', true FROM products WHERE handle = 'casual-denim-jeans';

-- Headphones variants (Color: Black, Silver, Blue)
INSERT INTO product_variants (product_id, title, price, sku, available) 
SELECT id, 'Color Black', 120.00, 'HDP-001-BLK', true FROM products WHERE handle = 'wireless-headphones' UNION ALL
SELECT id, 'Color Silver', 120.00, 'HDP-001-SLV', true FROM products WHERE handle = 'wireless-headphones' UNION ALL
SELECT id, 'Color Blue', 120.00, 'HDP-001-BLU', true FROM products WHERE handle = 'wireless-headphones';
