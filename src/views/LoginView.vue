<template>
  <div class="mx-auto w-full max-w-md space-y-3">
    <h2 class="text-2xl font-bold">Login</h2>
    <p class="opacity-70">Войдите, чтобы получить доступ к админ-панели.</p>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="space-y-1">
        <label class="label" for="email">
          <span class="label-text">Email</span>
        </label>
        <input
          id="email"
          v-model.trim="email"
          type="email"
          class="input input-bordered w-full"
          placeholder="you@example.com"
          autocomplete="email"
        />
        <p v-if="errors.email" class="text-sm text-error">{{ errors.email }}</p>
      </div>

      <div class="space-y-1">
        <label class="label" for="password">
          <span class="label-text">Password</span>
        </label>
        <input
          id="password"
          v-model.trim="password"
          type="password"
          class="input input-bordered w-full"
          placeholder="••••••••"
          autocomplete="current-password"
        />
        <p v-if="errors.password" class="text-sm text-error">{{ errors.password }}</p>
      </div>

      <button class="btn btn-primary w-full" :disabled="loading">
        {{ loading ? 'Loading...' : 'Login' }}
      </button>
    </form>

    <div class="flex items-center justify-between">
      <router-link to="/register" class="link link-primary">Register</router-link>
      <router-link to="/" class="link link-secondary">Back</router-link>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

const errors = reactive({
  email: '',
  password: ''
})

function validate() {
  errors.email = ''
  errors.password = ''

  if (!email.value) errors.email = 'Email is required'
  if (!password.value) errors.password = 'Password is required'

  return !errors.email && !errors.password
}

async function onSubmit() {
  if (!validate()) return
  loading.value = true
  try {
    const res = await auth.login({ email: email.value, password: password.value })
    if (!res.ok) {
      // Минимальная маппинг ошибок: показываем под password, если пароль неверный.
      if (res.message.toLowerCase().includes('password')) {
        errors.password = res.message
      } else {
        errors.email = res.message
      }
      return
    }

    const next = route.query.next ? String(route.query.next) : '/'
    router.push(next)
  } finally {
    loading.value = false
  }
}
</script>

