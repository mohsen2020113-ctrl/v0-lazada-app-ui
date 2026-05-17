import { ChevronLeft, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatMoney } from '../lib/shopify';
import type { PageId, NavigationParams } from '../App';

interface Props { navigate: (page: PageId, params?: NavigationParams) => void; params: NavigationParams; }

const STATUS_COLORS: Record<string, string> = {
  PAID: 'text-green-600 bg-green-50', PENDING: 'text-yellow-600 bg-yellow-50',
  REFUNDED: 'text-red-600 bg-red-50', FULFILLED: 'text-blue-600 bg-blue-50',
  UNFULFILLED: 'text-orange-600 bg-orange-50',
};

export default function OrdersPage({ navigate }: Props) {
  const { customer } = useAuth();
  const orders = (customer as any)?.orders?.edges?.map((e: any) => e.node) ?? [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={() => navigate('account')} className="text-gray-600"><ChevronLeft size={22} /></button>
        <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
      </div>
      {!customer ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
          <Package size={64} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Sign in to view orders</h2>
          <button onClick={() => navigate('login')} className="btn-primary mt-4">Sign In</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
          <Package size={64} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 text-sm mb-6">Start shopping to see your orders here</p>
          <button onClick={() => navigate('fashion')} className="btn-primary">Shop Now</button>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3">
          {orders.map((order: any) => (
            <div key={order.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-900">{order.name}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[order.financialStatus] || 'text-gray-600 bg-gray-50'}`}>{order.financialStatus}</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{new Date(order.processedAt).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 mb-2">{order.lineItems?.edges?.map((e: any) => e.node.title).join(', ')}</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-orange-500">{formatMoney(order.currentTotalPrice.amount, order.currentTotalPrice.currencyCode)}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.fulfillmentStatus] || 'text-gray-600 bg-gray-50'}`}>{order.fulfillmentStatus}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
