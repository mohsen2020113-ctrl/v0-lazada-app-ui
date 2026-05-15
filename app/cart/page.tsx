'use client';

import { useState } from 'react';
import { BottomNav } from '@/components/lee/bottom-nav-new';
import { useCart } from '@/app/contexts/cart-context';
import { useRouter } from 'next/navigation'; import { PaymentMethods } from '@/components/lee/payment-methods';
import { Trash2, Plus, Minus, ChevronRight, ChevronLeft, Heart, RotateCcw, Ticket, ShoppingBag, Truck, Tag, X, Check } from 'lucide-react';
import Image from 'next/image';

interface StoreItem {
  id: string;
  title: string;
  variant?: string;
  promo?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  selected: boolean;
}

interface StoreGroup {
  storeName: string;
  storeId: string;
  items: StoreItem[];
  freeShippingThreshold: number;
}

const initialStores: StoreGroup[] = [
  {
    storeName: 'Edge Wardrobe Official',
    storeId: 'edge1',
    freeShippingThreshold: 200,
    items: [
      {
        id: 'e1',
        title: 'Edge Wardrobe Black Shorts for Men - Quick Dry Breathable Fabric',
        variant: 'Black, Size L',
        promo: 'Buy 2, save 10%',
        price: 57.12,
        originalPrice: 79.00,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=200&h=200&fit=crop',
        selected: true,
      },
      {
        id: 'e2',
        title: 'Cotton T-Shirt Premium Quality Unisex Basic Tee',
        variant: 'White, Size M',
        price: 199.00,
        originalPrice: 299.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
        selected: true,
      },
    ],
  },
  {
    storeName: 'TechZone Store',
    storeId: 'tech1',
    freeShippingThreshold: 500,
    items: [
      {
        id: 't1',
        title: 'Wireless Bluetooth Earbuds TWS 5.0 with Charging Case',
        variant: 'Black',
        price: 890.00,
        originalPrice: 1290.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop',
        selected: false,
      },
    ],
  },
];

const unavailableItems = [
  {
    id: 'u1',
    title: 'Limited Edition Sneakers - Sold Out Collection',
    variant: 'Size 42',
    originalPrice: 3899.00,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
    reason: 'Out of stock',
  },
];

const recommendations = [
  { id: 'r1', title: 'Sports Water Bottle 750ml', price: 159, originalPrice: 299, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop', rating: 4.8, sold: '2.1k' },
  { id: 'r2', title: 'Wireless Phone Charger', price: 299, originalPrice: 499, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=200&fit=crop', rating: 4.9, sold: '5.3k' },
  { id: 'r3', title: 'Laptop Stand Aluminum', price: 459, originalPrice: 699, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop', rating: 4.7, sold: '1.8k' },
  { id: 'r4', title: 'LED Desk Lamp Adjustable', price: 389, originalPrice: 590, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop', rating: 4.6, sold: '3.2k' },
];

export default function CartPage() {
  const { items: cartContextItems, removeFromCart, updateQuantity: updateCartQuantity } = useCart();
  const router = useRouter();

  const [stores, setStores] = useState(initialStores);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const updateQuantity = (storeId: string, itemId: string, delta: number) => {
    setStores(prev => prev.map(store => {
      if (store.storeId === storeId) {
        return {
          ...store,
          items: store.items.map(item => {
            if (item.id === itemId) {
              return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
          }),
        };
      }
      return store;
    }));
  };

  const toggleItemSelect = (storeId: string, itemId: string) => {
    setStores(prev => prev.map(store => {
      if (store.storeId === storeId) {
        return {
          ...store,
          items: store.items.map(item => {
            if (item.id === itemId) {
              return { ...item, selected: !item.selected };
            }
            return item;
          }),
        };
      }
      return store;
    }));
  };

  const toggleStoreSelect = (storeId: string) => {
    setStores(prev => prev.map(store => {
      if (store.storeId === storeId) {
        const allSelected = store.items.every(item => item.selected);
        return {
          ...store,
          items: store.items.map(item => ({ ...item, selected: !allSelected })),
        };
      }
      return store;
    }));
  };

  const selectAll = () => {
    const allSelected = stores.every(store => store.items.every(item => item.selected));
    setStores(prev => prev.map(store => ({
      ...store,
      items: store.items.map(item => ({ ...item, selected: !allSelected })),
    })));
  };

  const removeItem = (storeId: string, itemId: string) => {
    setStores(prev => prev.map(store => {
      if (store.storeId === storeId) {
        return {
          ...store,
          items: store.items.filter(item => item.id !== itemId),
        };
      }
      return store;
    }).filter(store => store.items.length > 0));
    setShowDeleteConfirm(null);
  };

  const selectedItems = stores.flatMap(store => store.items.filter(item => item.selected));
  const selectedCount = selectedItems.length;
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedVoucher ? subtotal * 0.1 : 0;
  const shipping = subtotal >= 200 ? 0 : 29;
  const total = subtotal - discount + shipping;
  const totalItems = stores.reduce((sum, store) => sum + store.items.reduce((s, i) => s + i.quantity, 0), 0);
  const allSelected = stores.length > 0 && stores.every(store => store.items.every(item => item.selected));

  const freeShippingProgress = Math.min(100, (subtotal / 200) * 100);
  const amountForFreeShipping = Math.max(0, 200 - subtotal);

  return (
    <div className="min-h-screen min-h-dvh bg-gray-100 flex flex-col max-w-[430px] mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white px-3 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">My Cart ({totalItems})</h1>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-full">
          <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[10px] text-blue-600 font-medium">Free Returns</span>
        </div>
      </header>

      {/* Empty Cart State */}
      {stores.length === 0 && unavailableItems.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-16 h-16 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 text-center mb-6">Looks like you haven&apos;t added anything to your cart yet</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#f85c98] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#ec407a] transition-colors"
          >
            Start Shopping
          </button>
        </div>
      )}

      {(stores.length > 0 || unavailableItems.length > 0) && (
        <main className="flex-1 pb-44 overflow-y-auto hide-scrollbar">
          {/* Free Shipping Progress */}
          {subtotal < 200 && subtotal > 0 && (
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 mx-3 mt-3 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-5 h-5" />
                <span className="font-semibold">Add AED {amountForFreeShipping.toFixed(0)} more for FREE shipping!</span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {subtotal >= 200 && (
            <div className="bg-teal-50 border border-teal-200 mx-3 mt-3 rounded-xl p-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-teal-600" />
              <span className="text-teal-700 font-medium">You qualify for FREE shipping!</span>
            </div>
          )}

          {/* Store Sections */}
          {stores.map((store) => (
            <div key={store.storeId} className="bg-white mx-3 mt-3 rounded-xl overflow-hidden">
              {/* Store Header */}
              <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-100">
                <input
                  type="checkbox"
                  checked={store.items.every(item => item.selected)}
                  onChange={() => toggleStoreSelect(store.storeId)}
                  className="w-5 h-5 rounded border-gray-300 text-[#f85c98] focus:ring-[#f85c98]"
                />
                <div className="w-8 h-8 bg-gradient-to-br from-[#f85c98] to-[#ec407a] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {store.storeName.charAt(0)}
                </div>
                <span className="font-bold text-gray-900 flex-1">{store.storeName}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              {/* Cart Items */}
              {store.items.map((item) => (
                <div key={item.id} className="flex gap-3 px-3 py-3 border-b border-gray-50 last:border-0">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleItemSelect(store.storeId, item.id)}
                    className="w-5 h-5 rounded border-gray-300 text-[#f85c98] focus:ring-[#f85c98] mt-4 flex-shrink-0"
                  />

                  <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm text-gray-900 line-clamp-2 leading-tight mb-1 font-medium">
                      {item.title}
                    </h3>
                    {item.variant && (
                      <button className="flex items-center text-xs text-gray-500 mb-1 bg-gray-100 px-2 py-0.5 rounded">
                        {item.variant} <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                    {item.promo && (
                      <span className="inline-block bg-pink-100 text-[#f85c98] text-[10px] font-bold px-1.5 py-0.5 rounded mb-2">
                        {item.promo}
                      </span>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="text-[#f85c98] font-bold">AED {item.price.toFixed(2)}</span>
                        {item.originalPrice && (
                          <span className="text-gray-400 text-xs line-through ml-1">AED {item.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(item.id)}
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(store.storeId, item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(store.storeId, item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Voucher Section */}
          <button
            onClick={() => setShowVoucherModal(true)}
            className="bg-white mx-3 mt-3 rounded-xl p-4 flex items-center gap-3 w-full text-left"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Ticket className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {appliedVoucher ? 'Voucher Applied' : 'Apply Voucher Code'}
              </p>
              {appliedVoucher && (
                <p className="text-sm text-green-600">10% OFF - {appliedVoucher}</p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Unavailable Items */}
          {unavailableItems.length > 0 && (
            <div className="bg-white mx-3 mt-3 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">Unavailable ({unavailableItems.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Heart className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {unavailableItems.map((item) => (
                <div key={item.id} className="flex gap-3 px-3 py-3 opacity-60">
                  <div className="w-5 h-5 mt-4" />

                  <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover grayscale"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-800/80 text-white text-[9px] py-1 text-center font-medium">
                      {item.reason}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm text-gray-700 line-clamp-2 leading-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">{item.variant}</p>
                    <span className="text-gray-400 line-through">AED {item.originalPrice.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* You Might Also Like */}
          <div className="bg-white mx-3 mt-3 rounded-xl p-4 mb-3">
            <h3 className="font-bold text-gray-900 mb-3">You Might Also Like</h3>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {recommendations.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(`/product/${item.handle}`)}
                  className="flex-shrink-0 w-32 text-left"
                >
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                      -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-2 mb-1">{item.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-[#f85c98]">AED {item.price}</span>
                    <span className="text-[10px] text-gray-400 line-through">AED {item.originalPrice}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">{item.sold} sold</p>
                </button>
              ))}
            </div>
          </div>
        </main>
      )}

      <PaymentMethods />{/* Bottom Checkout Bar */}
      {stores.length > 0 && (
        <div className="fixed bottom-16 md:bottom-20 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-gray-200 z-40">
          {/* Order Summary */}
          <div className="px-4 py-3 border-b border-gray-100 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({selectedCount} items)</span>
              <span className="font-medium">AED {subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Voucher Discount</span>
                <span className="text-green-600 font-medium">-AED {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                {shipping === 0 ? 'FREE' : `AED ${shipping.toFixed(2)}`}
              </span>
            </div>
          </div>

          {/* Checkout Actions */}
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={selectAll}
                className="w-5 h-5 rounded border-gray-300 text-[#f85c98] focus:ring-[#f85c98]"
              />
              <span className="text-sm font-medium text-gray-700">All</span>
            </div>

            <div className="flex-1 text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-[#f85c98]">AED {total.toFixed(2)}</p>
            </div>

            <button
              disabled={selectedCount === 0}
              className="bg-[#f85c98] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#ec407a] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Checkout ({selectedCount})
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Remove Item?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to remove this item from your cart?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const store = stores.find(s => s.items.some(i => i.id === showDeleteConfirm));
                  if (store) removeItem(store.storeId, showDeleteConfirm);
                }}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-[430px] rounded-t-2xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg">Apply Voucher</h3>
              <button onClick={() => setShowVoucherModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="Enter voucher code"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f85c98]"
                />
                <button
                  onClick={() => {
                    if (voucherCode) {
                      setAppliedVoucher(voucherCode);
                      setShowVoucherModal(false);
                    }
                  }}
                  className="px-6 py-3 bg-[#f85c98] text-white rounded-lg font-bold hover:bg-[#ec407a] transition-colors"
                >
                  Apply
                </button>
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">Available Vouchers</h4>
              <div className="space-y-2">
                {['SAVE10', 'FREESHIP', 'NEWUSER'].map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      setAppliedVoucher(code);
                      setShowVoucherModal(false);
                    }}
                    className="w-full p-3 border-2 border-dashed border-[#f85c98] rounded-lg flex items-center gap-3 hover:bg-pink-50 transition-colors"
                  >
                    <Tag className="w-5 h-5 text-[#f85c98]" />
                    <div className="text-left flex-1">
                      <p className="font-bold text-[#f85c98]">{code}</p>
                      <p className="text-xs text-gray-500">10% off your order</p>
                    </div>
                    <span className="text-sm text-[#f85c98] font-medium">Apply</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
