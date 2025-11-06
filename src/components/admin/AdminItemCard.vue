<!-- src/components/admin/AdminItemCard.vue -->
<template>
  <div class="border border-gray-200 rounded-lg p-4 mb-4 flex justify-between items-center">
    <div class="flex items-center gap-4">
      <img :src="item.imageUrl" :alt="item.name" class="w-16 h-16 object-contain border rounded">
      <div>
        <h3 class="font-medium">{{ item.name }}</h3>
        <p class="text-gray-500 text-sm">{{ item.description }}</p>
        <p class="font-semibold">{{ item.price }} руб.</p>
      </div>
    </div>
    <div class="flex gap-2">
      <button
        @click="$emit('edit', item)"
        class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition text-sm"
      >
        Редактировать
      </button>
      <button
        @click="$emit('delete', item.id)"
        class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition text-sm"
      >
        Удалить
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
    // Пример структуры item:
    //{ id: Number, name: String, description: String, price: Number, imageUrl: String }
  }
})

defineEmits(['edit', 'delete'])
</script>
