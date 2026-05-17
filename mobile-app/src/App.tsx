import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Home, ShoppingBag, MessageCircle, User, Search, ShoppingCart, Heart, Bell, Zap, Tag, Wallet, Package, Star } from 'lucide-react';

import HomePage from './pages/HomePage';
import FashionPage from './pages/FashionPage';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import MessagesPage from './pages/MessagesPage';
import SearchPage from './pages/SearchPage';
import ProductPage from './pages/ProductPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import NotificationsPage from './pages/NotificationsPage';
import WalletPage from './pages/WalletPage';
import VouchersPage from './pages/VouchersPage';
import DailyDealsPage from './pages/DailyDealsPage';
import FlashSalePage from './pages/FlashSalePage';
import LoginPage from './pages/LoginPage';

export type PageId =
  | 'home' | 'fashion' | 'cart' | 'account' | 'messages'
  | 'search' | 'product' | 'wishlist' | 'orders' | 'checkout'
  | 'notifications' | 'wallet' | 'vouchers' | 'daily-deals'
  | 'flash-sale' | 'login';

export interface NavigationParams {
  productHandle?: string;
  collectionHandle?: string;
  [key: string]: unknown;
}

function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [navParams, setNavParams] = useState<NavigationParams>({});

  const navigate = (page: PageId, params: NavigationParams = {}) => {
    setActivePage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    { id: 'home' as PageId, label: 'Home', icon: Home },
    { id: 'fashion' as PageId, label: 'Shop', icon: ShoppingBag },
    { id: 'messages' as PageId, label: 'Chat', icon: MessageCircle },
    { id: 'cart' as PageId, label: 'Cart', icon: ShoppingCart },
    { id: 'account' as PageId, label: 'Account', icon: User },
  ];

  const renderPage = () => {
    const props = { navigate, params: navParams };
    switch (activePage) {
      case 'home': return <HomePage {...props} />;
      case 'fashion': return <FashionPage {...props} />;
      case 'cart': return <CartPage {...props} />;
      case 'account': return <AccountPage {...props} />;
      case 'messages': return <MessagesPage {...props} />;
      case 'search': return <SearchPage {...props} />;
      case 'product': return <ProductPage {...props} />;
      case 'wishlist': return <WishlistPage {...props} />;
      case 'orders': return <OrdersPage {...props} />;
      case 'checkout': return <CheckoutPage {...props} />;
      case 'notifications': return <NotificationsPage {...props} />;
      case 'wallet': return <WalletPage {...props} />;
      case 'vouchers': return <VouchersPage {...props} />;
      case 'daily-deals': return <DailyDealsPage {...props} />;
      case 'flash-sale': return <FlashSalePage {...props} />;
      case 'login': return <LoginPage {...props} />;
      default: return <HomePage {...props} />;
    }
  };

  const showBottomNav = !['checkout', 'product', 'login'].includes(activePage);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden">
          <main className={`flex-1 overflow-y-auto ${showBottomNav ? 'pb-16' : ''}`}>
            {renderPage()}
          </main>

          {showBottomNav && (
            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 z-50">
              <div className="flex">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => navigate(id)}
                    className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                      activePage === id
                        ? 'text-orange-500'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Icon size={22} strokeWidth={activePage === id ? 2.5 : 1.8} />
                    <span className="text-[10px] font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
