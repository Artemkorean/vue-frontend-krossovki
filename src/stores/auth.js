// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from './user'

// Ключи для localStorage
const TOKEN_STORAGE_KEY = 'auth_token'
const USER_STORAGE_KEY = 'user_info'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const userStore = useUserStore() // ✅ Получаем один раз — это безопасно в Pinia setup store

  // Состояние
  const token = ref(localStorage.getItem(TOKEN_STORAGE_KEY) || null)
  const loading = ref(false)
  const error = ref(null)

  // Вычисляемые свойства
  const isAuthenticated = computed(() => !!token.value)

  // Действия
  const login = async (email, password) => {
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      const response = await axios.post('http://localhost:4000/auth/login', { email, password })

      const { token: newToken, user: userData } = response.data

      // Сохраняем токен и пользователя
      token.value = newToken
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken)

      userStore.setUser(userData)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))

      // 🔁 Перенаправление по роли
      if (userData.role === 'admin') {
        await router.push('/adminProfile')
      } else {
        await router.push('/home')
      }
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.response?.data?.message || 'Ошибка входа'

      // Очищаем данные при ошибке
      userStore.clearUser()
      token.value = null
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(USER_STORAGE_KEY)

      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    userStore.clearUser()
    token.value = null
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    // router.push('/') // опционально
  }

  const initializeAuth = () => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
    const storedUserData = localStorage.getItem(USER_STORAGE_KEY)

    if (storedToken) {
      token.value = storedToken
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData)
          userStore.setUser(parsedUserData)
        } catch (e) {
          console.error('Ошибка при разборе данных пользователя:', e)
          // Очищаем повреждённые данные
          localStorage.removeItem(TOKEN_STORAGE_KEY)
          localStorage.removeItem(USER_STORAGE_KEY)
          token.value = null
        }
      }
    }
  }

  return {
    token: readonly(token),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    login,
    logout,
    initializeAuth,
  }
})
