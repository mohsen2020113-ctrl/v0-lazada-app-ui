'use client';

import { CartProvider } from '@/app/contexts/cart-context';
import { FavoritesProvider } from '@/app/contexts/favorites-context';
import { UserProvider } from '@/app/contexts/user-context';
import { I18nProvider } from '@/lib/i18n-context';
import { AuthProvider } from '@/lib/auth-context';
import { CartDrawer } from '@/components/lee/cart-drawer';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <UserProvider>
          <CartProvider>
            <FavoritesProvider>
              {children}
              <CartDrawer />
            </FavoritesProvider>
          </CartProvider>
        </UserProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
