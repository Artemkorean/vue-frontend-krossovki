// src/stores/user.js

// Перемещаем константу в начало файла, за пределы defineStore
const USER_STORAGE_KEY = 'sneakers-user'

import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue' // <-- Добавлен readonly

export const useUserStore = defineStore('user', () => {
  // Состояние
  const initialUser = JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || null
  const user = ref(initialUser)

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



