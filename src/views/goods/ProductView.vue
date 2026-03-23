<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Product</h2>
      <span class="badge badge-ghost">id: {{ route.params.id }}</span>
    </div>

    <div v-if="good" class="space-y-4">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="md:col-span-1">
          <div class="relative overflow-hidden rounded-box border border-base-300">
            <img :src="good.image" :alt="good.title" class="h-64 w-full object-cover" />
            <div class="absolute left-2 top-2">
              <span v-if="good.isExclusive" class="badge badge-warning">Exclusive</span>
              <span v-else class="badge badge-ghost">{{ good.category }}</span>
            </div>
          </div>
        </div>

        <div class="md:col-span-2 space-y-3">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-3xl font-bold">{{ good.title }}</h3>
              <div class="mt-2 flex flex-wrap gap-2">
                <span class="badge badge-outline">{{ good.genre }}</span>
                <span v-if="good.bpm > 0" class="badge badge-outline">BPM {{ good.bpm }}</span>
                <span v-if="good.musicalKey" class="badge badge-outline">{{ good.musicalKey }}</span>
              </div>
            </div>

            <div class="text-right">
              <div class="text-sm opacity-70">Price</div>
              <div class="text-2xl font-semibold">${{ good.price }}</div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button class="btn btn-primary btn-sm" @click="addToCart">
              Add to cart
            </button>
            <button class="btn btn-secondary btn-sm" @click="buyNow">
              Buy now
            </button>
            <router-link to="/" class="btn btn-ghost btn-sm">Back</router-link>
          </div>
        </div>
      </div>

      <div class="tabs tabs-boxed">
        <router-link :to="`/goods/${route.params.id}/overview`" class="tab">
          Overview
        </router-link>
        <router-link :to="`/goods/${route.params.id}/details`" class="tab">
          Details
        </router-link>
        <router-link :to="`/goods/${route.params.id}/seller`" class="tab">
          Seller
        </router-link>
      </div>

      <div class="rounded-box border border-base-300 p-4">
        <router-view />
      </div>
    </div>

    <div v-else class="rounded-box border border-base-300 p-6 text-center">
      <div class="text-lg font-semibold">Product not found</div>
      <div class="opacity-70 mt-1">Попробуйте вернуться на главную.</div>
      <router-link to="/" class="btn btn-primary mt-4">Go home</router-link>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

import { useCartStore } from '../../stores/cart.js'
import { useGoods } from '../../composables/useGoods.js'

const route = useRoute()

const cart = useCartStore()
const { getById } = useGoods()

const good = computed(() => getById(route.params.id))

function addToCart() {
  cart.addItem(route.params.id, 1)
}

function buyNow() {
  cart.addItem(route.params.id, 1)
  alert('Added to cart. Proceed in cart to checkout.')
}
</script>

