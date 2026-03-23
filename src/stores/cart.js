import { defineStore } from 'pinia'

const CART_KEY = 'beatstars_cart'

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function hasWindow() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function loadCart() {
  if (!hasWindow()) return []
  const raw = localStorage.getItem(CART_KEY)
  const data = safeJsonParse(raw)
  return Array.isArray(data) ? data : []
}

function saveCart(cart) {
  if (!hasWindow()) return
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    // entries: [{ id, qty }]
    items: loadCart()
  }),

  getters: {
    // Примечание: цена берётся из товаров через composable позже.
    cartCount: (state) => state.items.reduce((acc, it) => acc + Number(it.qty || 0), 0),
    snapshot: (state) => state.items
  },

  actions: {
    addItem(goodsId, qty = 1) {
      const id = String(goodsId)
      const amount = Math.max(1, Number(qty) || 1)

      const existing = this.items.find((it) => String(it.id) === id)
      if (existing) {
        existing.qty = Number(existing.qty || 0) + amount
      } else {
        this.items.push({ id, qty: amount })
      }

      saveCart(this.items)
    },

    removeItem(goodsId) {
      const id = String(goodsId)
      this.items = this.items.filter((it) => String(it.id) !== id)
      saveCart(this.items)
    },

    setQty(goodsId, qty) {
      const id = String(goodsId)
      const amount = Math.max(0, Number(qty) || 0)

      const existing = this.items.find((it) => String(it.id) === id)
      if (!existing) return

      if (amount <= 0) {
        this.removeItem(id)
        return
      }

      existing.qty = amount
      saveCart(this.items)
    },

    clear() {
      this.items = []
      saveCart(this.items)
    }
  }
})

