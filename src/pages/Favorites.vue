<script setup>
  import {ref,onMounted,computed } from 'vue'
  import { useFavorite } from '../composables/useFavorites';
  import axios from 'axios'
  import CardList from '../components/CardList.vue'
  import { useItem } from '@/composables/useItem';
  // import ProductModal from '../components/ProductModal.vue'

const { fetchAllItems, loading, error } = useItem();
const allItems = ref([]);

const { favorites, removeFromFavorite } = useFavorite();

const favoriteItems = computed(() => {
  return allItems.value.filter(item => favorites.value.has(item.id));
});

const removeFromFavorites = (item) => {
  removeFromFavorite(item); // удаляем из localStorage
};

onMounted(async () => {
  try {
    const data = await fetchAllItems();
    allItems.value = data.map(obj => ({
      ...obj,
      isFavorite: favorites.value.has(obj.id), // отмечаем, если в избранном
      favoriteId: favorites.value.has(obj.id) ? obj.id : null
    }));
  } catch (err) {
    console.error('Ошибка при загрузке товаров:', err);
  }
});
</script>
<template>
  <h1 class="text-center text-3xl text-gray-500 mb-8">Избранное</h1>
  <!-- Показываем загрузку -->
  <div v-if="loading" class="text-center py-12">
    Загрузка избранных товаров...
  </div>
  <!-- Показываем ошибку -->
  <div v-else-if="error" class="text-center py-12 text-red-500">
    Ошибка: {{ error }}
  </div>
  <div v-if="favorites.length === 0" class="text-center py-12">
      <div class="mx-auto max-w-md">
        <img
          src="/prohibited-line.png"
          alt="Пустое избранное"
          class="mx-auto h-10 w-10 mb-6"
        >
        <h2 class="text-2xl font-medium text-gray-700 mb-2">В избранном ничего нет</h2>
        <p class="text-gray-500 mb-6">Добавьте хотя бы одну пару кроссовок в избранное</p>
        <router-link
          to="/"
          class="inline-block bg-gray-500 hover:bg-gray-900 text-white px-6 py-2 rounded-md transition"
        >
          Вернуться в каталог
        </router-link>
      </div>
    </div>

  <CardList
    :items="favoriteItems"
    is-favorites="true"
    @remove-from-favorites="removeFromFavorites"
  />


</template>
