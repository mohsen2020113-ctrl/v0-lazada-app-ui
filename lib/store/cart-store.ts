import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  color?: string
  size?: string
  sellerName: string
}

type NewCartItem = Omit<CartItem, 'id'>

interface CartStore {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (item: NewCartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
}

// SSR-safe storage: returns a no-op storage on the server so
// Zustand persist never touches localStorage during Next.js pre-rendering,
// preventing the "localStorage is not defined" crash.
const safeStorage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    } as unknown as Storage
  }
  return localStorage
})

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
          )

          let newItems
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          } else {
            const newItem: CartItem = {
              id: `${item.productId}-${Date.now()}`,
              ...item,
            }
            newItems = [...state.items, newItem]
          }

          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

          return { items: newItems, totalItems, totalPrice }
        }),

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id)
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

          return { items: newItems, totalItems, totalPrice }
        }),

      updateQuantity: (id, qty) =>
        set((state) => {
          const newItems = state.items
            .map((item) => item.id === id ? { ...item, quantity: Math.max(0, qty) } : item)
            .filter((item) => item.quantity > 0)

          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

          return { items: newItems, totalItems, totalPrice }
        }),

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'lee-cart-v1',
      storage: safeStorage,
    }
  )
)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  color?: string
  size?: string
  sellerName: string
}

interface CartStore {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
          )

          let newItems
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          } else {
            const newItem: CartItem = {
              id: `${item.productId}-${Date.now()}`,
              ...item,
            }
            newItems = [...state.items, newItem]
          }

          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

          return { items: newItems, totalItems, totalPrice }
        }),

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id)
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

          return { items: newItems, totalItems, totalPrice }
        }),

      updateQuantity: (id, qty) =>
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(0, qty) } : item
          ).filter((item) => item.quantity > 0)

          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

          return { items: newItems, totalItems, totalPrice }
        }),

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'lee-cart-v1',
    }
  )
)
