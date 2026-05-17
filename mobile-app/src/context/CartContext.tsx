import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { createCart, getCart, addToCart, updateCartLine, removeFromCart, type ShopifyCart } from '../lib/shopify';

interface CartState { cart: ShopifyCart | null; loading: boolean; error: string | null; }
type CartAction =
  | { type: 'SET_CART'; payload: ShopifyCart }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART': return { ...state, cart: action.payload, loading: false, error: null };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_ERROR': return { ...state, error: action.payload, loading: false };
    case 'CLEAR_CART': return { cart: null, loading: false, error: null };
    default: return state;
  }
};

interface CartContextValue {
  cart: ShopifyCart | null; loading: boolean; error: string | null; itemCount: number;
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void; checkout: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_ID_KEY = 'lee_cart_id';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { cart: null, loading: false, error: null });

  const loadCart = useCallback(async () => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cart = await getCart(cartId);
      if (cart) dispatch({ type: 'SET_CART', payload: cart });
      else localStorage.removeItem(CART_ID_KEY);
    } catch { dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' }); }
  }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  const getOrCreateCart = async () => {
    if (state.cart) return state.cart;
    const cart = await createCart();
    localStorage.setItem(CART_ID_KEY, cart.id);
    dispatch({ type: 'SET_CART', payload: cart });
    return cart;
  };

  const addItem = async (merchandiseId: string, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cart = await getOrCreateCart();
      const updatedCart = await addToCart(cart.id, [{ merchandiseId, quantity }]);
      localStorage.setItem(CART_ID_KEY, updatedCart.id);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch { dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' }); }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!state.cart) return;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await updateCartLine(state.cart.id, lineId, quantity);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch { dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart' }); }
  };

  const removeItem = async (lineId: string) => {
    if (!state.cart) return;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await removeFromCart(state.cart.id, [lineId]);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch { dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item' }); }
  };

  const clearCart = () => { localStorage.removeItem(CART_ID_KEY); dispatch({ type: 'CLEAR_CART' }); };
  const checkout = () => { if (state.cart?.checkoutUrl) window.open(state.cart.checkoutUrl, '_blank'); };
  const itemCount = state.cart?.totalQuantity ?? 0;

  return (
    <CartContext.Provider value={{ cart: state.cart, loading: state.loading, error: state.error, itemCount, addItem, updateItem, removeItem, clearCart, checkout }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
