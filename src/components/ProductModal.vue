<script setup>
import { ref, watch, computed, onMounted, inject } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  product: Object,
  sizes: Array,
  features: Array,
  isInCart: Boolean
});

const emit = defineEmits(['close', 'toggleFavorite', 'toggleCart']);
const { cart } = inject('cart');

const selectedSize = ref(null);
const localIsInCart = ref(props.isInCart);

// Обновляем состояние при изменении корзины
const updateCartState = () => {
  const isInCart = cart.value.some(item => item.id === props.product.id);
  localIsInCart.value = isInCart;

  if (!isInCart) {
    selectedSize.value = null;
  }
};

// Инициализация состояния
onMounted(() => {
  updateCartState();
});

// Следим за изменениями в корзине
watch(() => cart.value, () => {
  updateCartState();
}, { deep: true });

// Синхронизация с пропсами
watch(() => props.isInCart, (newVal) => {
  localIsInCart.value = newVal;
});

// При открытии модалки обновляем состояние
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    updateCartState();

    // Восстанавливаем выбранный размер из localStorage
    const savedState = localStorage.getItem(`cartState_${props.product.id}`);
    if (savedState) {
      const { selectedSize: savedSize } = JSON.parse(savedState);
      if (localIsInCart.value) {
        selectedSize.value = savedSize;
      }
    }
  }
});

const closeModal = () => {
  emit('close');
};

const handleCartAction = () => {
  if (props.sizes?.length && !selectedSize.value && !localIsInCart.value) {
    alert('Пожалуйста, выберите размер');
    return;
  }

  emit('toggleCart', {
    ...props.product,
    selectedSize: selectedSize.value
  });

  // Обновляем состояние сразу
  localIsInCart.value = !localIsInCart.value;

  // Сохраняем в localStorage только при добавлении в корзину
  if (localIsInCart.value) {
    localStorage.setItem(`cartState_${props.product.id}`, JSON.stringify({
      isInCart: localIsInCart.value,
      selectedSize: selectedSize.value
    }));
  } else {
    localStorage.removeItem(`cartState_${props.product.id}`);
  }
};

const selectSize = (size) => {
  selectedSize.value = size;
};

const buttonState = computed(() => ({
  disabled: localIsInCart.value,
  text: localIsInCart.value ? 'Товар добавлен' : 'Добавить в корзину'
}));
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="relative p-8">
        <button
          @click="closeModal"
          class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          <img src="/close.svg" alt="Close" class="w-6 h-6">
        </button>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Изображение товара -->
          <div class="flex justify-center">
            <img
              :src="product.imageUrl"
              :alt="product.title"
              class="max-h-80 object-contain"
            >
          </div>

          <!-- Информация о товаре -->
          <div>
            <h2 class="text-2xl font-bold mb-4">{{ product.title }}</h2>

            <div class="flex items-center mb-6">
              <span class="text-3xl font-bold mr-4">{{ product.price }} руб.</span>
              <div class="flex space-x-2">
                <!-- <button
                  @click.stop="toggleFavorite"
                  class="p-2 rounded-full hover:bg-gray-100"
                >
                  <img
                    :src="product.isFavorite ? '/like-2.svg' : '/like-1.svg'"
                    alt="Favorite"
                    class="w-6 h-6"
                  >
                </button> -->
                <button
                  @click="handleCartAction"
                  :disabled="buttonState.disabled"
                  class="px-4 py-2 border rounded-lg transition-colors duration-200"
                  :class="{
                    'bg-gray-400 text-white cursor-not-allowed': localIsInCart,
                    'bg-gray-600 text-white hover:bg-gray-800': !localIsInCart
                  }"
                >
                {{ buttonState.text }}
                </button>
              </div>
            </div>

            <!-- Размеры -->
            <div class="mb-6" v-if="sizes && sizes.length && !localIsInCart">
              <h3 class="text-lg font-semibold mb-3">Размеры:</h3>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="size in sizes"
                  :key="size"
                  @click="selectSize(size)"
                  class="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  :class="{' bg-slate-900 text-white': selectedSize === size}"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Описание -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">Описание:</h3>
              <p class="text-gray-600">{{ product.description || 'Описание отсутствует' }}</p>
            </div>

            <!-- Характеристики -->
            <div v-if="features && features.length">
              <h3 class="text-lg font-semibold mb-2">Характеристики:</h3>
              <ul class="list-disc pl-5 text-gray-600">
                <li v-for="(feature, index) in features" :key="index">{{ feature }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
