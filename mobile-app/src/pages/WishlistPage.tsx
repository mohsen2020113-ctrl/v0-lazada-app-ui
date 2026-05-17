import { useState } from 'react';
import { ChevronLeft, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { PageId, NavigationParams } from '../App';

interface Props { navigate: (page: PageId, params?: NavigationParams) => void; params: NavigationParams; }

export default function WishlistPage({ navigate }: Props) {
  const { addItem } = useCart();
  const [wishlist] = useState<string[]>(() => JSON.parse(localStorage.getItem('lee_wishlist') || '[]'));
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={() => navigate('account')}><ChevronLeft size={22} /></button>
        <h1 className="text-xl font-bold text-gray-900">Wishlist</h1>
      </div>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
        <Heart size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 text-sm mb-6">Save items you love by tapping the heart icon</p>
        <button onClick={() => navigate('fashion')} className="btn-primary">Explore Products</button>
      </div>
    </div>
  );
}
