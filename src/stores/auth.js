import { defineStore } from 'pinia'

// Admin credentials (hard-coded, as required by the assignment):
// email:    admin@beatstars.com
// password: admin123

const ADMIN_EMAIL = 'admin@beatstars.com'
const ADMIN_PASSWORD = 'admin123'

const USERS_KEY = 'beatstars_users'
const AUTH_KEY = 'beatstars_auth'

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY)
  const data = safeJsonParse(raw)
  return Array.isArray(data) ? data : []
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function loadAuth() {
  const raw = localStorage.getItem(AUTH_KEY)
  const data = safeJsonParse(raw)
  if (!data || typeof data !== 'object') return null
  if (!data.email) return null
  return data
}

function saveAuth(auth) {
  if (!auth) {
    localStorage.removeItem(AUTH_KEY)
    return
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: loadAuth()
  }),

  getters: {
    isLoggedIn: (state) => Boolean(state.user?.email),
    isAdmin: (state) => state.user?.email === ADMIN_EMAIL,
    username: (state) => state.user?.username || ''
  },

  actions: {
    async login({ email, password }) {
      const cleanEmail = String(email || '').trim().toLowerCase()
      const cleanPassword = String(password || '')

      if (!cleanEmail || !cleanPassword) return { ok: false, message: 'Missing fields' }

      // Admin shortcut
      if (cleanEmail === ADMIN_EMAIL && cleanPassword === ADMIN_PASSWORD) {
        const auth = { username: 'Admin', email: ADMIN_EMAIL }
        this.user = auth
        saveAuth(auth)
        return { ok: true, message: '' }
      }

      // Normal users from localStorage
      const users = loadUsers()
      const found = users.find((u) => String(u.email).toLowerCase() === cleanEmail)
      if (!found) return { ok: false, message: 'User not found' }
      if (found.password !== cleanPassword) return { ok: false, message: 'Invalid password' }

      const auth = { username: found.username, email: found.email }
      this.user = auth
      saveAuth(auth)
      return { ok: true, message: '' }
    },

    async register({ username, email, password }) {
      const cleanUsername = String(username || '').trim()
      const cleanEmail = String(email || '').trim().toLowerCase()
      const cleanPassword = String(password || '')

      if (!cleanUsername || !cleanEmail || !cleanPassword) {
        return { ok: false, message: 'Missing fields' }
      }

      // Admin cannot be registered (keeps hard-coded behavior consistent)
      if (cleanEmail === ADMIN_EMAIL) {
        return { ok: false, message: 'This email is reserved' }
      }

      const users = loadUsers()
      const exists = users.some((u) => String(u.email).toLowerCase() === cleanEmail)
      if (exists) return { ok: false, message: 'Email already used' }

      users.push({
        username: cleanUsername,
        email: cleanEmail,
        password: cleanPassword
      })
      saveUsers(users)

      return { ok: true, message: '' }
    },

    logout() {
      this.user = null
      saveAuth(null)
    },

    // Used later by Header toggle (guest <-> admin)
    setAdminMode(enabled) {
      if (!enabled) {
        this.user = null
        saveAuth(null)
        return
      }

      const auth = { username: 'Admin', email: ADMIN_EMAIL }
      this.user = auth
      saveAuth(auth)
    }
  }
})

