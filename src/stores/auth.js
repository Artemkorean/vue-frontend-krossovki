// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'


// Ключи для localStorage
const TOKEN_STORAGE_KEY = 'auth_token'
const USER_STORAGE_KEY = 'user_info'

export const useAuthStore = defineStore('auth', () => {
  // Состояние
  const token = ref(localStorage.getItem(TOKEN_STORAGE_KEY) || null)
  // УБРАЛИ: const userStore = useUserStore() // Больше не получаем здесь
  const loading = ref(false)
  const error = ref(null)
  const router = useRouter()

  // Вычисляемые свойства
  const isAuthenticated = computed(() => !!token.value)

  // Действия
  const login = async (email, password) => {
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      // ДОБАВИЛИ: Получаем экземпляр userStore внутри функции
      const userStore = useUserStore();
      // ИСПРАВЛЕНО: Добавлен http://
      const response = await axios.post('http://localhost:4000/auth/login', { email, password })

      const { token: newToken, user: userData } = response.data

      token.value = newToken
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken)

      // ИСПОЛЬЗУЕМ: userStore, полученный внутри функции
      userStore.setUser(userData)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))

      await router.push('/admin-profile')

    } catch (err) {
      console.error('Login error:', err)
      error.value = err.response?.data?.message || 'Ошибка входа'
      // ИСПОЛЬЗУЕМ: userStore для logout внутри login
      const userStore = useUserStore(); // Получаем снова для logout
      userStore.clearUser() // Очищаем данные пользователя из user store
      token.value = null
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(USER_STORAGE_KEY)
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    // ДОБАВИЛИ: Получаем экземпляр userStore внутри функции
    const userStore = useUserStore();
    token.value = null
    userStore.clearUser()
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    // router.push('/') // Можно перенаправить после выхода
  }

  const initializeAuth = () => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
    const storedUserData = localStorage.getItem(USER_STORAGE_KEY)

    if (storedToken) {
      token.value = storedToken
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData)
          // ДОБАВИЛИ: Получаем экземпляр userStore внутри функции
          const userStore = useUserStore();
          userStore.setUser(parsedUserData) // Устанавливаем данные
        } catch (e) {
          console.error('Ошибка при разборе данных пользователя из localStorage:', e)
          localStorage.removeItem(TOKEN_STORAGE_KEY)
          localStorage.removeItem(USER_STORAGE_KEY)
          token.value = null
        }
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        token.value = null
      }
    }
  }

  return {
    token: readonly(token),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated, // Вычисляемое свойство
    login,    // Добавлены действия
    logout,
    initializeAuth,
  }
})

import { readonly } from 'vue'
import { useUserStore } from './user' // <-- ИМПОРТИРУЕМ В КОНЦЕ ФАЙЛА или в начале, но используем внутри функций
