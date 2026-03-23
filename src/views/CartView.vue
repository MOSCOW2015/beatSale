<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-1">
        <h2 class="text-2xl font-bold">Cart</h2>
        <p class="opacity-70">Добавленные товары сохраняются в `localStorage`.</p>
      </div>

      <router-link to="/" class="btn btn-ghost">Back to goods</router-link>
    </div>

    <div v-if="cartItems.length === 0" class="rounded-box border border-base-300 p-6 text-center">
      <div class="text-lg font-semibold">Your cart is empty</div>
      <div class="opacity-70 mt-1">Добавьте товар со страницы продукта.</div>
    </div>

    <div v-else class="space-y-3">
      <div v-for="it in cartItems" :key="it.id" class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <img
                v-if="it.good?.image"
                :src="it.good.image"
                :alt="it.good.title"
                class="h-16 w-16 rounded-box object-cover"
              />
              <div class="space-y-1">
                <div class="font-semibold">{{ it.good?.title || 'Unknown product' }}</div>
                <div class="text-sm opacity-70">
                  ${{ it.good?.price ?? 0 }} x {{ it.qty }}
                </div>
              </div>
            </div>

            <div class="flex flex-col items-end gap-2">
              <div class="font-semibold">${{ it.lineTotal }}</div>
              <div class="flex items-center gap-2">
                <button class="btn btn-sm btn-ghost" @click="decQty(it.id)">-</button>
                <span class="min-w-8 text-center">{{ it.qty }}</span>
                <button class="btn btn-sm btn-ghost" @click="incQty(it.id)">+</button>
                <button class="btn btn-sm btn-outline" @click="remove(it.id)">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-box border border-base-300 p-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm opacity-70">Total</div>
            <div class="text-2xl font-bold">${{ totalSum }}</div>
          </div>
          <button class="btn btn-primary" :disabled="checkoutLoading" @click="checkout">
            {{ checkoutLoading ? 'Оформляем...' : 'Оформить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useCartStore } from '../stores/cart.js'
import { useGoods } from '../composables/useGoods.js'

const cart = useCartStore()
const { getById } = useGoods()

const checkoutLoading = ref(false)

const cartItems = computed(() => {
  return cart.items
    .map((it) => {
      const good = getById(it.id)
      const qty = Number(it.qty || 0)
      const price = Number(good?.price || 0)
      const lineTotal = Math.round(price * qty * 100) / 100
      return {
        id: it.id,
        qty,
        good,
        lineTotal
      }
    })
    .filter((it) => it.qty > 0)
})

const totalSum = computed(() => {
  return Math.round(cartItems.value.reduce((acc, it) => acc + Number(it.lineTotal || 0), 0) * 100) / 100
})

function incQty(id) {
  const entry = cart.items.find((it) => String(it.id) === String(id))
  const qty = Number(entry?.qty || 0) + 1
  cart.setQty(id, qty)
}

function decQty(id) {
  const entry = cart.items.find((it) => String(it.id) === String(id))
  const qty = Number(entry?.qty || 0) - 1
  cart.setQty(id, qty)
}

function remove(id) {
  cart.removeItem(id)
}

function checkoutText() {
  const lines = cartItems.value
    .map((it) => {
      const title = it.good?.title || it.id
      return `${title} x${it.qty}`
    })
    .join(', ')

  return `Заказ оформлен! Товары: ${lines}. Сумма: $${totalSum.value}`
}

async function checkout() {
  if (cartItems.value.length === 0) {
    alert('Cart is empty')
    return
  }

  checkoutLoading.value = true
  try {
    alert(checkoutText())
    // В рамках демо очистим корзину:
    cart.clear()
  } finally {
    checkoutLoading.value = false
  }
}
</script>

