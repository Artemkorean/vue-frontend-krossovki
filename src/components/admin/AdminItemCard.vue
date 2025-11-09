<!-- src/components/admin/AdminItemCard.vue -->
<template>
  <div class="h-full rounded-3xl bg-white border border-slate-100 p-6 flex justify-between items-center transition hover:-translate-y-1 hover:shadow-lg">
    <div class="flex items-center gap-4">
      <div class="w-16 h-16 flex items-center justify-center border border-slate-200 rounded-xl overflow-hidden">
        <img :src="item.imageUrl" :alt="item.name" class="max-w-full max-h-full object-contain">
      </div>
      <div>
        <h3 class="font-semibold line-clamp-1">{{ item.name }}</h3>
        <p class="text-slate-500 text-sm line-clamp-1 mt-1">{{ item.description }}</p>
        <p class="font-bold text-slate-800 mt-1">{{ item.price }} руб.</p>
      </div>
    </div>

    <div class="flex gap-2">
      <button
        @click="$emit('edit', item)"
        class="bg-blue-500 text-white py-1.5 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition shadow-sm hover:shadow"
      >
        Редактировать
      </button>
      <button
        @click="$emit('delete', item.id)"
        class="bg-red-500 text-white py-1.5 px-4 rounded-lg text-sm font-medium hover:bg-red-600 transition shadow-sm hover:shadow"
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
