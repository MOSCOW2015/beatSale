<template>
  <header class="sticky top-0 z-10 border-b bg-base-100/80 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
      <router-link to="/" class="text-xl font-bold tracking-tight">
        BeatStars
      </router-link>

      <div class="flex items-center gap-2">
        <router-link to="/cart" class="btn btn-ghost btn-sm">
          Cart
          <span v-if="cartCount > 0" class="badge badge-primary ml-2">
            {{ cartCount }}
          </span>
        </router-link>

        <template v-if="auth.isAdmin">
          <router-link to="/admin" class="btn btn-sm btn-secondary">Admin Panel</router-link>
          <span class="hidden text-sm opacity-80 sm:inline">{{ auth.username }}</span>
          <button class="btn btn-sm btn-ghost" @click="logout">Logout</button>
        </template>

        <template v-else-if="auth.isLoggedIn">
          <span class="hidden text-sm opacity-80 sm:inline">{{ auth.username }}</span>
          <button class="btn btn-sm btn-ghost" @click="logout">Logout</button>
        </template>

        <template v-else>
          <router-link to="/login" class="btn btn-sm btn-primary">Login</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth.js'
import { useCartStore } from '../stores/cart.js'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()

const cartCount = computed(() => cart.cartCount)

function logout() {
  auth.logout()
  router.push('/')
}
</script>

