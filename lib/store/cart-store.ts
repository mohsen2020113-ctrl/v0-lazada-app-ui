import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase } from '../supabase'

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
    syncToSupabase: (userId: string) => Promise<void>
    loadFromSupabase: (userId: string) => Promise<void>
}

const safeStorage = createJSONStorage(() => {
    if (typeof window === 'undefined') {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} } as unknown as Storage
    }
    return localStorage
})

function calcTotals(items: CartItem[]) {
    return {
          totalItems: items.reduce((s, i) => s + i.quantity, 0),
          totalPrice: items.reduce((s, i) => s + i.price * i.quantity, 0),
    }
}

export const useCartStore = create<CartStore>()(
    persist(
          (set, get) => ({
                  items: [],
                  totalItems: 0,
                  totalPrice: 0,

                  addItem: (item) => set((state) => {
                            const existing = state.items.find(
                                        (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
                                      )
                            let newItems: CartItem[]
                            if (existing) {
                                        newItems = state.items.map((i) =>
                                                      i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
                                                                             )
                            } else {
                                        newItems = [...state.items, { id: `${item.productId}-${Date.now()}`, ...item }]
                            }
                            return { items: newItems, ...calcTotals(newItems) }
                  }),

                  removeItem: (id) => set((state) => {
                            const newItems = state.items.filter((i) => i.id !== id)
                            return { items: newItems, ...calcTotals(newItems) }
                  }),

                  updateQuantity: (id, qty) => set((state) => {
                            const newItems = state.items
                              .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, qty) } : i))
                              .filter((i) => i.quantity > 0)
                            return { items: newItems, ...calcTotals(newItems) }
                  }),

                  clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),

                  syncToSupabase: async (userId: string) => {
                            if (!supabase || !userId) return
                            const { items } = get()
                            await supabase.from('user_cart').upsert({
                                        user_id: userId,
                                        items: JSON.stringify(items),
                                        updated_at: new Date().toISOString()
                            })
                  },

                  loadFromSupabase: async (userId: string) => {
                            if (!supabase || !userId) return
                            const { data, error } = await supabase
                              .from('user_cart')
                              .select('items')
                              .eq('user_id', userId)
                              .single()
                            if (error || !data) return
                            try {
                                        const items: CartItem[] = JSON.parse(data.items)
                                        set({ items, ...calcTotals(items) })
                            } catch {}
                  },
          }),
      { name: 'lee-cart-v1', storage: safeStorage }
        )
  )
