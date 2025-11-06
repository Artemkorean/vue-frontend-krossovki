
<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">{{ itemToEdit ? 'Редактировать товар' : 'Создать товар' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Название</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Описание</label>
          <input
            v-model="form.description"
            type="text"
            required
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Цена</label>
          <input
            v-model.number="form.price"
            type="number"
            required
            min="0"
            step="0.01"
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">URL изображения</label>
          <input
            v-model="form.imageUrl"
            type="text"
            required
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <!-- Добавьте другие поля по необходимости -->

        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
          >
            Отмена
          </button>
          <button
            type="submit"
            class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            {{ itemToEdit ? 'Сохранить' : 'Создать' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  itemToEdit: Object,
  createItemFunc: Function,
  updateItemFunc: Function
})

const emit = defineEmits(['close', 'item-created', 'item-updated'])

const form = ref({
  name: '',
  description: '',
  price: 0,
  imageUrl: ''
})

// Синхронизируем форму с itemToEdit при его изменении
watch(() => props.itemToEdit, (newItem) => {
  if (newItem) {
    form.value = { ...newItem } // Копируем данные
  } else {
    // Сброс формы при создании
    form.value = { name: '', description: '', price: 0, imageUrl: '' }
  }
}, { immediate: true }) // immediate: true запускает watcher сразу при создании

const handleSubmit = async () => {
  try {
    if (props.itemToEdit) {
      // Используем функцию обновления из props
      const updatedItem = await props.updateItemFunc(props.itemToEdit.id, form.value)
      emit('item-updated', updatedItem)
    } else {
      // Используем функцию создания из props
      const newItem = await props.createItemFunc(form.value)
      emit('item-created', newItem)
    }
    emit('close')
  } catch (err) {
    console.error('Ошибка при сохранении товара:', err)
    // Обработка ошибки (например, показ сообщения)
  }
}
</script>
