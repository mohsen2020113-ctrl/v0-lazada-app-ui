import { ChevronLeft, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatMoney } from '../lib/shopify';
import type { PageId, NavigationParams } from '../App';

interface Props { navigate: (page: PageId, params?: NavigationParams) => void; params: NavigationParams; }

export default function CheckoutPage({ navigate }: Props) {
  const { cart, checkout } = useCart();
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={() => navigate('cart')}><ChevronLeft size={22} /></button>
        <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
      </div>
      <div className="px-4 py-6">
        <div className="card p-6 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink size={28} className="text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Secure Checkout</h2>
          <p className="text-gray-500 text-sm mb-4">You'll be redirected to our secure Shopify checkout to complete your purchase.</p>
          {cart && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{cart.totalQuantity} items</span>
                <span>{formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-orange-500">{formatMoney(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}</span>
              </div>
            </div>
          )}
          <button onClick={checkout} className="btn-primary w-full flex items-center justify-center gap-2">Continue to Shopify <ExternalLink size={16} /></button>
          <button onClick={() => navigate('cart')} className="w-full text-gray-500 text-sm mt-3">Back to Cart</button>
        </div>
      </div>
    </div>
  );
}
