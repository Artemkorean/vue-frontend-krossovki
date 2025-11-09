// src/composables/useItem.js
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth.js'
import { useUserStore } from '../stores/user.js'
// Базовый URL для API товаров
const BASE_URL = 'http://localhost:4000/items'

export function useItem() {
  // Состояния для загрузки и ошибок
  const loading = ref(false)
  const error = ref(null)

  // Получаем экземпляр store аутентификации
  const authStore = useAuthStore()
  const userStore = useUserStore()

  // --- Внутренняя функция для проверки роли ---
  const _checkAdminRole = () => {
    // Проверяем, аутентифицирован ли пользователь и является ли он администратором
    // используя вычисляемое свойство из auth store и связанное с ним user store
    if (!authStore.isAuthenticated || !userStore.isAdmin) {
      const errorMsg = 'Доступ запрещен: Требуется роль администратора'
      error.value = errorMsg
      console.error(errorMsg)
      throw new Error(errorMsg)
    }
  }

  // --- Внутренняя функция для настройки заголовков ---
  const _getAuthHeaders = () => {
    if (!authStore.token) {
      const errorMsg = 'Токен отсутствует'
      error.value = errorMsg
      console.error(errorMsg)
      throw new Error(errorMsg)
    }
    return {
      Authorization: `Bearer ${authStore.token}`,
    }
  }

  // Получить все товары
  const fetchAllItems = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(BASE_URL)
      return response.data // Предполагается, что API возвращает массив
    } catch (err) {
      console.error('Ошибка при получении товаров:', err)
      error.value = err.response?.data?.message || 'Не удалось загрузить товары'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Создать товар (требует админа)
  const createItem = async (newItemData) => {
    _checkAdminRole() // Проверяем роль перед выполнением
    loading.value = true
    error.value = null
    try {
      const headers = _getAuthHeaders()
      const response = await axios.post(BASE_URL, newItemData, { headers })
      return response.data // Возвращаем созданный объект
    } catch (err) {
      console.error('Ошибка при создании товара:', err)
      // Обработка ошибок от бэкенда (401, 403, 422 и т.д.)
      if (err.response && [401, 403].includes(err.response.status)) {
        error.value = 'Ошибка аутентификации или доступа при создании товара'
        // Возможно, стоит вызвать logout, если токен недействителен
        // authStore.logout()
      } else {
        error.value = err.response?.data?.message || 'Не удалось создать товар'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  // Обновить товар (требует админа)
  const updateItem = async (id, updatedData) => {
    _checkAdminRole()
    loading.value = true
    error.value = null
    try {
      const headers = _getAuthHeaders()
      // Используем PATCH для частичного обновления
      const response = await axios.patch(`${BASE_URL}/${id}`, updatedData, { headers })
      return response.data
    } catch (err) {
      console.error(`Ошибка при обновлении товара с ID ${id}:`, err)
      if (err.response && [401, 403].includes(err.response.status)) {
        error.value = 'Ошибка аутентификации или доступа при обновлении товара'
        // authStore.logout() // При необходимости
      } else {
        error.value = err.response?.data?.message || `Не удалось обновить товар с ID ${id}`
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  // Удалить товар (требует админа)
  const deleteItem = async (id) => {
    _checkAdminRole()
    loading.value = true
    error.value = null
    try {
      const headers = _getAuthHeaders()
      await axios.delete(`${BASE_URL}/${id}`, { headers })
      console.log(`Товар с ID ${id} успешно удалён`)
      // Успешное удаление, обычно API не возвращает тело
    } catch (err) {
      console.error(`Ошибка при удалении товара с ID ${id}:`, err)
      if (err.response && [401, 403].includes(err.response.status)) {
        error.value = 'Ошибка аутентификации или доступа при удалении товара'
        // authStore.logout() // При необходимости
      } else {
        error.value = err.response?.data?.message || `Не удалось удалить товар с ID ${id}`
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // Состояния
    loading: readonly(loading),
    error: readonly(error),
    // Методы
    fetchAllItems,
    createItem,
    updateItem,
    deleteItem,
  }
}

// Импортируем readonly для безопасности
import { readonly } from 'vue'
