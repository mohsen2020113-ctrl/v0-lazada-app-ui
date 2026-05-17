import { ChevronLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { PageId, NavigationParams } from '../App';

interface Props { navigate: (page: PageId, params?: NavigationParams) => void; params: NavigationParams; }

const VOUCHERS = [
  { id: '1', code: 'LEE20', discount: '20% OFF', desc: 'Min. spend $50', expiry: 'May 31, 2026', color: 'from-orange-400 to-red-500', used: false },
  { id: '2', code: 'FREE10', discount: '$10 OFF', desc: 'No minimum spend', expiry: 'Jun 15, 2026', color: 'from-purple-400 to-pink-500', used: false },
  { id: '3', code: 'SHIP0', discount: 'Free Shipping', desc: 'All orders', expiry: 'Jun 30, 2026', color: 'from-blue-400 to-cyan-500', used: true },
];

export default function VouchersPage({ navigate }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code); setTimeout(() => setCopied(null), 2000);
  };
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={() => navigate('account')}><ChevronLeft size={22} /></button>
        <h1 className="text-xl font-bold text-gray-900">Vouchers</h1>
      </div>
      <div className="px-4 py-4 space-y-3">
        {VOUCHERS.map(v => (
          <div key={v.id} className={`rounded-2xl overflow-hidden ${v.used ? 'opacity-60' : ''}`}>
            <div className={`bg-gradient-to-r ${v.color} p-4 text-white`}>
              <p className="text-2xl font-bold">{v.discount}</p>
              <p className="text-sm opacity-90">{v.desc}</p>
            </div>
            <div className="bg-white p-4 flex items-center justify-between border-t-2 border-dashed border-gray-100">
              <div>
                <p className="font-mono font-bold text-gray-900 text-lg">{v.code}</p>
                <p className="text-xs text-gray-400">Expires {v.expiry}</p>
              </div>
              {v.used ? (
                <span className="text-xs text-gray-400 font-medium">USED</span>
              ) : (
                <button onClick={() => copy(v.code)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${copied === v.code ? 'bg-green-500 text-white' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
                  {copied === v.code ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
