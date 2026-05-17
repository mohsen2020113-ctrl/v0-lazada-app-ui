import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatMoney } from '../lib/shopify';
import type { PageId, NavigationParams } from '../App';

interface Props { navigate: (page: PageId, params?: NavigationParams) => void; params: NavigationParams; }

export default function CartPage({ navigate }: Props) {
  const { cart, loading, updateItem, removeItem, checkout } = useCart();
  const lines = cart?.lines.edges.map(e => e.node) ?? [];

  if (loading && !cart) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full spinner" />
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">My Cart</h1>
        <p className="text-sm text-gray-500">{cart?.totalQuantity ?? 0} items</p>
      </div>
      {lines.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
          <ShoppingBag size={64} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything yet.</p>
          <button onClick={() => navigate('fashion')} className="btn-primary flex items-center gap-2">Start Shopping <ArrowRight size={16} /></button>
        </div>
      ) : (
        <>
          <div className="px-4 py-4 space-y-3">
            {lines.map(line => (
              <div key={line.id} className="card p-3 flex gap-3">
                {line.merchandise.image && (
                  <img src={line.merchandise.image.url} alt={line.merchandise.product.title} className="w-20 h-20 object-cover rounded-xl bg-gray-100 flex-none" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">{line.merchandise.product.title}</p>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{line.merchandise.title}</p>
                  <p className="price-tag text-sm mt-1">{formatMoney(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => line.quantity > 1 ? updateItem(line.id, line.quantity - 1) : removeItem(line.id)} className="px-2.5 py-1.5 text-gray-600 active:bg-gray-100"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-medium">{line.quantity}</span>
                      <button onClick={() => updateItem(line.id, line.quantity + 1)} className="px-2.5 py-1.5 text-gray-600 active:bg-gray-100"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(line.id)} className="text-red-400 p-1.5 active:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mx-4 card p-4 mb-4">
            <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal ({cart?.totalQuantity} items)</span><span>{formatMoney(cart?.cost.subtotalAmount.amount ?? '0', cart?.cost.subtotalAmount.currencyCode ?? 'USD')}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-green-600 font-medium">Free</span></div>
              <div className="h-px bg-gray-100 my-2" />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-orange-500">{formatMoney(cart?.cost.totalAmount.amount ?? '0', cart?.cost.totalAmount.currencyCode ?? 'USD')}</span></div>
            </div>
          </div>
          <div className="px-4 pb-6">
            <button onClick={checkout} className="btn-primary w-full flex items-center justify-center gap-2 text-base">Proceed to Checkout <ArrowRight size={18} /></button>
            <button onClick={() => navigate('fashion')} className="w-full text-center text-sm text-gray-500 mt-3">Continue Shopping</button>
          </div>
        </>
      )}
    </div>
  );
}
