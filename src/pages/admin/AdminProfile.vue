<!-- src/pages/admin/AdminProfile.vue -->
<template>
  <div>
    <h1 class="text-center text-3xl text-gray-500">Панель администратора</h1>
    <main class="max-w-2xl mx-auto py-10">
      <div class="bg-white rounded-lg shadow p-8">
        <p>Добро пожаловать, администратор!</p>
        <!-- Кнопка выхода -->
        <div class="mt-4 flex justify-end">
          <button
            @click="handleLogout"
            class="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Выйти
          </button>
        </div>
        <!-- Кнопка для открытия модального окна -->
        <div class="mt-6">
          <!-- Показываем кнопку, если не идет загрузка -->
          <button
            @click="openCreateModal"
            class="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition"
            v-if="!loading"
          >
            Создать товар
          </button>
          <div v-else class="text-gray-500">Загрузка...</div>
        </div>
        <AdminItemList
          :items="items"
          :loading="loading"
          @edit-item="openEditModal"
          @delete-item="confirmDeleteItem"
        />
        <!-- Отображаем ошибки, если есть -->
        <div v-if="error" class="text-red-500 text-sm mt-2">
          Ошибка: {{ error }}
        </div>
      </div>
    </main>

    <!-- Компонент модального окна -->
    <CreateItemModal
      :is-open="isCreateModalOpen"
      :item-to-edit="itemToEdit"
      :create-item-func="createItemFunc"
      :update-item-func="updateItemFunc"
      @close="closeCreateModal"
      @item-created="onItemCreated"
      @item-updated="onItemUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CreateItemModal from '../../components/admin/CreateItemModal.vue'
import { useItem } from '../../composables/useItem.js'
import AdminItemList from '../../components/admin/AdminItemList.vue'
import { useAuthStore } from '../../stores/auth.js'
import { useRouter } from 'vue-router'

const { fetchAllItems, error: itemError, createItem: createItemFunc, updateItem: updateItemFunc, deleteItem } = useItem() // Переименовываем для избежания конфликта имен

const authStore = useAuthStore()
const router = useRouter()
// Локальное состояние для списка товаров и состояния загрузки
const items = ref([])
const loading = ref(false) // Состояние загрузки для этого компонента
const error = ref(null) // Локальное состояние ошибки (опционально, можно использовать itemError)

// Состояния для модального окна
const isCreateModalOpen = ref(false)
const itemToEdit = ref(null)

// Функция выхода
const handleLogout = async () => {
  try {
    authStore.logout() // очищает токен, пользователя и localStorage
    router.push('/') // перенаправляем на главную
  } catch (err) {
    console.error('Ошибка при выходе:', err)
  }
}
// Функция открытия модального окна
const openCreateModal = () => {
  itemToEdit.value = null // Сбрасываем перед созданием
  isCreateModalOpen.value = true
}

const openEditModal = (item) => {
  itemToEdit.value = item         // устанавливаем редактируемый товар
  isCreateModalOpen.value = true  // открываем то же модальное окно (в режиме редактирования)
}

// Функция закрытия модального окна
const closeCreateModal = () => {
  isCreateModalOpen.value = false
  itemToEdit.value = null // Сбрасываем после закрытия
}

// Обработчик успешного создания товара
const onItemCreated = (newItem) => {
  console.log('Новый товар создан:', newItem)
  // Добавляем новый товар в локальный список
  items.value.push(newItem)
  closeCreateModal() // Закрываем модальное окно
}

const onItemUpdated = (updatedItem) => {
  console.log('Товар обновлен:', updatedItem)
  // Найдем индекс обновленного элемента и заменим его
  const index = items.value.findIndex(item => item.id === updatedItem.id)
  if (index !== -1) {
    items.value[index] = updatedItem
  }
  closeCreateModal()
}

// Функция подтверждения удаления (можно реализовать модальное окно подтверждения)
const confirmDeleteItem = async (id) => {
  if (confirm(`Вы уверены, что хотите удалить товар с ID ${id}?`)) {
    try {
      await deleteItem(id)
      console.log(`Товар с ID ${id} успешно удален`)
      // Удаляем товар из локального списка
      items.value = items.value.filter(item => item.id !== id)
    } catch (err) {
      console.error('Не удалось удалить товар:', err)
      error.value = itemError.value // Используем ошибку из useItem
    }
  }
}

// Загрузка списка товаров при монтировании
onMounted(async () => {
  console.log('onMounted AdminProfile called') // Добавлено
  loading.value = true
  error.value = null
  try {
    console.log('Before fetchAllItems call') // Добавлено
    const fetchedItems = await fetchAllItems()
    console.log('After fetchAllItems call, data:', fetchedItems) // Добавлено
    items.value = fetchedItems
    console.log('Local items state updated:', items.value) // Добавлено
  } catch (err) {
    console.error('Ошибка в onMounted AdminProfile:', err) // Добавлено
    console.error('itemError.value после ошибки:', itemError.value) // Добавлено
    error.value = itemError.value
  } finally {
    loading.value = false
    console.log('Loading state set to false') // Добавлено
  }
})
</script>
