// src/stores/user.js

// Перемещаем константу в начало файла, за пределы defineStore
const USER_STORAGE_KEY = 'user_info'

import { defineStore } from 'pinia'
import { ref, computed } from 'vue' // <-- Добавлен readonly

export const useUserStore = defineStore('user', () => {
  // Состояние
  const user = ref(null) // { id, email, username, role, ... }

  // Вычисляемые свойства
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Действия
  // Установить данные пользователя
  const setUser = (userData) => {
    user.value = { ...userData } // Создаём копию, чтобы избежать внешних изменений
  }

  // Очистить данные пользователя
  const clearUser = () => {
    user.value = null
  }

  // Обновить данные пользователя (например, после редактирования)
  const updateUser = (newData) => {
    if (user.value) {
      user.value = { ...user.value, ...newData }
      // Обновить в localStorage, используя константу, определённую в области файла
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user.value))
    }
  }

  return {
    // Состояние
    user: readonly(user), // <-- readonly теперь определён
    // Вычисляемые
    isAdmin,
    // Действия
    setUser,
    clearUser,
    updateUser, // если понадобится
  }
})

// <-- Добавлен импорт readonly
import { readonly } from 'vue'
