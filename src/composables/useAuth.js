// src/composables/useAuth.js (упрощённый вариант или можно удалить)
import { useAuthStore } from '../stores/auth.js'
import { useUserStore } from '../stores/user.js'

export function useAuth() {
  const authStore = useAuthStore()
  const userStore = useUserStore()

  return {
    // Состояния из store
    token: authStore.token,
    user: userStore.user, // Получаем из user store
    loading: authStore.loading,
    error: authStore.error,
    // Вычисляемые
    isAuthenticated: authStore.isAuthenticated,
    isAdmin: userStore.isAdmin, // Получаем из user store
    // Методы из store
    login: authStore.login,
    logout: authStore.logout,
    // другие методы, если нужно
  }
}
