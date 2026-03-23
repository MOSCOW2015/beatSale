<template>
  <div class="mx-auto w-full max-w-md space-y-3">
    <h2 class="text-2xl font-bold">Register</h2>
    <p class="opacity-70">Создайте аккаунт, чтобы покупать и добавлять товары в корзину.</p>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="space-y-1">
        <label class="label" for="username">
          <span class="label-text">Username</span>
        </label>
        <input
          id="username"
          v-model.trim="username"
          type="text"
          class="input input-bordered w-full"
          placeholder="yourname"
          autocomplete="username"
        />
        <p v-if="errors.username" class="text-sm text-error">{{ errors.username }}</p>
      </div>

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
          autocomplete="new-password"
        />
        <p v-if="errors.password" class="text-sm text-error">{{ errors.password }}</p>
      </div>

      <button class="btn btn-primary w-full" :disabled="loading">
        {{ loading ? 'Loading...' : 'Create account' }}
      </button>
    </form>

    <div class="flex items-center justify-between">
      <router-link to="/login" class="link link-primary">Login</router-link>
      <router-link to="/" class="link link-secondary">Back</router-link>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

const errors = reactive({
  username: '',
  email: '',
  password: ''
})

function validate() {
  errors.username = ''
  errors.email = ''
  errors.password = ''

  if (!username.value) errors.username = 'Username is required'
  if (!email.value) errors.email = 'Email is required'
  if (!password.value) errors.password = 'Password is required'

  return !errors.username && !errors.email && !errors.password
}

async function onSubmit() {
  if (!validate()) return
  loading.value = true
  try {
    const res = await auth.register({
      username: username.value,
      email: email.value,
      password: password.value
    })

    if (!res.ok) {
      const msg = String(res.message || '')
      if (msg.toLowerCase().includes('email')) errors.email = msg
      else errors.username = msg
      return
    }

    router.push('/login')
  } finally {
    loading.value = false
  }
}
</script>

