import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'https://4d52dc6e33fee8ad.mokky.dev';

export function useCart() {
  const cart = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Получаем текущую корзину
  const fetchCart = async () => {
    try {
      isLoading.value = true;
      const { data } = await axios.get(`${API_URL}/cart`);
      cart.value = data;
    } catch (err) {
      error.value = err.message;
      console.error('Ошибка при загрузке корзины:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Добавляем товар в корзину
  const addToCart = async (product) => {
    try {
      isLoading.value = true;
      await axios.post(`${API_URL}/cart`, product);
      await fetchCart(); // Обновляем корзину после добавления
    } catch (err) {
      error.value = err.message;
      console.error('Ошибка при добавлении в корзину:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Удаляем товар из корзины
  const removeFromCart = async (itemId) => {
    try {
      isLoading.value = true;
      await axios.delete(`${API_URL}/cart/${itemId}`);
      await fetchCart(); // Обновляем корзину после удаления
    } catch (err) {
      error.value = err.message;
      console.error('Ошибка при удалении из корзины:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    cart,
    isLoading,
    error,
    fetchCart,
    addToCart,
    removeFromCart
  };
}
