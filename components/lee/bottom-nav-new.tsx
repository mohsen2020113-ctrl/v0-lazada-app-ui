'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Radio, MessageCircle, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/app/contexts/cart-context';
import { useFavorites } from '@/app/contexts/favorites-context';

export function BottomNav() {
  const pathname = usePathname();
  const { cartCount, openCart } = useCart();
  const { favorites } = useFavorites();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/', action: null },
    { id: 'fashion', label: 'Fashion', icon: ShoppingBag, href: '/category/women', action: null },
    { id: 'live', label: 'Live', icon: Radio, href: '/live', action: null },
    { id: 'messages', label: 'Messages', icon: MessageCircle, href: '/messages', badge: 99, action: null },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, href: null, badge: cartCount, action: openCart },
    { id: 'account', label: 'Account', icon: User, href: '/account', action: null },
  ];

  const isActive = (href: string | null) => {
    if (!href) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-1 py-1.5 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-bottom">
      <div className="flex justify-around items-stretch max-w-2xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          // Use button for items with actions (cart)
          if (item.action) {
            return (
              <button
                key={item.id}
                onClick={() => item.action!()}
                className="flex-1 flex flex-col items-center justify-center py-2 px-2 relative group transition-all"
              >
                <div className={`relative ${active ? 'text-[#f85c98]' : 'text-gray-600'}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] sm:text-[9px] rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold min-w-[16px]">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[9px] sm:text-[10px] mt-1 font-medium transition-colors ${active ? 'text-[#f85c98]' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          // Use Link for navigation items
          return (
            <Link
              key={item.id}
              href={item.href || '/'}
              className="flex-1 flex flex-col items-center justify-center py-2 px-2 relative group transition-all"
            >
              <div className={`relative ${active ? 'text-[#f85c98]' : 'text-gray-600'}`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] sm:text-[9px] rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold min-w-[16px]">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] sm:text-[10px] mt-1 font-medium transition-colors ${active ? 'text-[#f85c98]' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

