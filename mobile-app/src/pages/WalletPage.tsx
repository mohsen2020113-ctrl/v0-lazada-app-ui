import { ChevronLeft, Wallet, ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { PageId, NavigationParams } from '../App';

interface Props { navigate: (page: PageId, params?: NavigationParams) => void; params: NavigationParams; }

const TRANSACTIONS = [
  { id: '1', type: 'credit', desc: 'Refund from Order #1231', amount: '+$25.00', date: 'May 14', color: 'text-green-600' },
  { id: '2', type: 'debit', desc: 'Purchase - Summer Dress', amount: '-$49.99', date: 'May 12', color: 'text-red-500' },
  { id: '3', type: 'credit', desc: 'Loyalty Points Earned', amount: '+$5.00', date: 'May 10', color: 'text-green-600' },
  { id: '4', type: 'debit', desc: 'Purchase - Sneakers', amount: '-$89.99', date: 'May 8', color: 'text-red-500' },
];

export default function WalletPage({ navigate }: Props) {
  const { customer } = useAuth();
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={() => navigate('account')}><ChevronLeft size={22} /></button>
        <h1 className="text-xl font-bold text-gray-900">Wallet</h1>
      </div>
      <div className="bg-gradient-to-br from-orange-500 to-red-500 mx-4 mt-4 rounded-2xl p-6 text-white">
        <p className="text-orange-100 text-sm mb-1">Available Balance</p>
        <p className="text-4xl font-bold mb-4">$0.00</p>
        <div className="flex gap-3">
          <button className="flex-1 bg-white/20 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-1.5"><Plus size={16} /> Top Up</button>
          <button className="flex-1 bg-white/20 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-1.5"><ArrowUpRight size={16} /> Withdraw</button>
        </div>
      </div>
      <div className="px-4 mt-5">
        <h3 className="section-title mb-3">Recent Transactions</h3>
        {!customer ? (
          <div className="text-center py-10 text-gray-500">
            <Wallet size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Sign in to view transactions</p>
            <button onClick={() => navigate('login')} className="btn-primary mt-4 text-sm px-6 py-2">Sign In</button>
          </div>
        ) : (
          <div className="card divide-y divide-gray-50">
            {TRANSACTIONS.map(({ id, type, desc, amount, date, color }) => (
              <div key={id} className="flex items-center gap-3 p-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${type === 'credit' ? 'bg-green-50' : 'bg-red-50'}`}>
                  {type === 'credit' ? <ArrowDownLeft size={18} className="text-green-500" /> : <ArrowUpRight size={18} className="text-red-500" />}
                </div>
                <div className="flex-1"><p className="text-sm font-medium text-gray-900">{desc}</p><p className="text-xs text-gray-400">{date}</p></div>
                <span className={`text-sm font-bold ${color}`}>{amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
