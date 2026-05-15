'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/app/contexts/cart-context';
import { createShopifyCart } from '@/lib/shopify';
import { useI18n } from '@/lib/i18n-context';

export function CartDrawer() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, cartCount, cartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { t, formatPrice: formatPriceI18n, isRTL } = useI18n();

  const formatPrice = (amount: number) => {
    return formatPriceI18n(amount);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsCheckingOut(true);
    
    try {
      // Convert cart items to Shopify line items
      const lines = items.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
      }));
      
      // Create Shopify cart and get checkout URL
      const cart = await createShopifyCart(lines);
      
      if (cart?.checkoutUrl) {
        // Redirect to Shopify checkout
        window.location.href = cart.checkoutUrl;
      } else {
        alert('Failed to create checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className={`fixed top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-in duration-300 ${isRTL ? 'left-0 slide-in-from-left' : 'right-0 slide-in-from-right'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ShoppingBag className="w-5 h-5 text-[#f85c98]" />
            <h2 className="text-lg font-bold text-gray-900">{t('nav.cart')}</h2>
            <span className="bg-[#f85c98] text-white text-xs px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <ShoppingBag className="w-20 h-20 text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('cart.empty')}</h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              {isRTL ? 'يبدو أنك لم تضف أي شيء إلى سلتك بعد.' : "Looks like you haven't added anything to your cart yet."}
            </p>
            <button
              onClick={closeCart}
              className="bg-[#f85c98] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#e91e8c] transition-colors"
            >
              {t('action.continueShopping')}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-gray-50 rounded-xl p-3"
                >
                  {/* Product Image */}
                  <Link
                    href={`/product/${item.handle}`}
                    onClick={closeCart}
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-white"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.handle}`}
                      onClick={closeCart}
                      className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-[#f85c98]"
                    >
                      {item.title}
                    </Link>
                    {item.variantTitle && item.variantTitle !== 'Default Title' && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.variantTitle}</p>
                    )}
                    <p className="text-[#f85c98] font-bold mt-1">{formatPrice(item.price)}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-4 space-y-3">
              {/* Subtotal */}
              <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-gray-600">{t('cart.subtotal')} ({cartCount} {t('cart.items')})</span>
                <span className="font-bold text-gray-900">{formatPrice(cartTotal)}</span>
              </div>
              
              {/* Shipping Note */}
              <p className="text-xs text-gray-500 text-center">
                {isRTL ? 'يتم حساب الشحن والضرائب عند الدفع' : 'Shipping & taxes calculated at checkout'}
              </p>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
                className="w-full bg-gradient-to-r from-[#f85c98] to-[#e91e8c] text-white py-3.5 rounded-full font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('status.loading')}
                  </>
                ) : (
                  <>
                    {t('action.checkout')} - {formatPrice(cartTotal)}
                  </>
                )}
              </button>

              {/* Continue Shopping */}
              <button
                onClick={closeCart}
                className="w-full text-gray-600 py-2 text-sm font-medium hover:text-[#f85c98] transition-colors"
              >
                {t('action.continueShopping')}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
