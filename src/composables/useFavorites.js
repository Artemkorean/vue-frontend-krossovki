// src/composables/useFavorite.js
import { ref, readonly, watch } from 'vue';

const FAVORITES_KEY = 'sneakers-favorites';

export function useFavorite() {
  const favorites = ref(new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []));

  // Синхронизация с localStorage
  watch(
    favorites,
    (newFavorites) => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...newFavorites]));
    },
    { deep: true }
  );

  const addToFavorite = (item) => {
    favorites.value.add(item.id);
    item.isFavorite = true;
    item.favoriteId = item.id; // можно не использовать, т.к. ID и так есть
  };

  const removeFromFavorite = (item) => {
    favorites.value.delete(item.id);
    item.isFavorite = false;
    item.favoriteId = null;
  };

  const toggleFavorite = (item) => {
    if (isFavorite(item.id)) {
      removeFromFavorite(item);
    } else {
      addToFavorite(item);
    }
  };

  const isFavorite = (itemId) => {
    return favorites.value.has(itemId);
  };

  const fetchFavorites = () => {
    // Возвращает массив ID избранных товаров
    return [...favorites.value];
  };

  return {
    addToFavorite,
    removeFromFavorite,
    toggleFavorite,
    isFavorite,
    fetchFavorites,
    favorites: readonly(favorites),
  };
}
