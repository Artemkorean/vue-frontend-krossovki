<!-- src/components/admin/AdminItemList.vue -->
<template>
  <div>
    <h2 class="text-lg font-medium mb-4">Список товаров</h2>
    <div v-if="items && items.length > 0">
      <AdminItemCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        @edit="onEdit"
        @delete="onDelete"
      />
    </div>
    <div v-else-if="loading" class="text-gray-500">
      Загрузка товаров...
    </div>
    <div v-else class="text-gray-500">
      Товаров пока нет.
    </div>
  </div>
</template>

<script setup>
import AdminItemCard from './AdminItemCard.vue'

defineProps({
  items: Array,
  loading: Boolean // Передаем состояние загрузки из родителя
})

const emit = defineEmits(['edit-item', 'delete-item'])

const onEdit = (item) => {
  emit('edit-item', item)
}

const onDelete = (id) => {
  emit('delete-item', id)
}
</script>
