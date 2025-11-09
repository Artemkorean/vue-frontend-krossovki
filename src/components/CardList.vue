<script setup>
  import Card from './Card.vue';
  import ProductModal from './ProductModal.vue';
  import { useFavorite } from '../composables/useFavorites.js';
  import { ref } from 'vue';

  defineProps({
    items:Array,
    isFavorites:Boolean
})
const { toggleFavorite: toggleFavoriteLocal } = useFavorite();

const emit = defineEmits(['add-to-cart', 'remove-from-favorites'])

const modalProduct = ref(null);
const isModalOpen = ref(false);

const openModal = (item) => {
  modalProduct.value = item;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const toggleFavorite = (item) => {
  toggleFavoriteLocal(item); // вызывает логику из useFavorite
  // Обновляем состояние в локальной копии для модального окна
  if (modalProduct.value && modalProduct.value.id === item.id) {
    modalProduct.value = {
      ...modalProduct.value,
      isFavorite: !modalProduct.value.isFavorite
    };
  }
};

const toggleCart = (item) => {
  emit('add-to-cart', item);
  if (modalProduct.value && modalProduct.value.id === item.id) {
    modalProduct.value.isAdded = !modalProduct.value.isAdded;
  }
};

</script>

<template>
  <div class="grid grid-cols-4 gap-5 auto-rows-fr" v-auto-animate>
    <Card
      v-for="item in items"
      :key="item.id"
      :id="item.id"
      :title="item.title"
      :imageUrl="item.imageUrl"
      :price="item.price"
      :onClickFavorite="isFavorites ? null : () => toggleFavoriteLocal(item)"
      :onClickAdd="isFavorites ? null : () => emit('add-to-cart',item)"
      :onClickRemove="isFavorites ? () => emit('remove-from-favorites', item) : null"
      :onClickCard="() => openModal(item)"
      :isFavorite="item.isFavorite"
      :isAdded="item.isAdded"
      :isFavorites="isFavorites"
    />
  </div>
  <ProductModal
    v-if="modalProduct"
    :isOpen="isModalOpen"
    :product="modalProduct"
    :sizes="['40', '41', '42', '43']"
    :features="['Материал: хлопок 100%', 'Страна производства: Турция']"
    @close="closeModal"
    @toggleFavorite="toggleFavorite"
    @toggleCart="toggleCart"
  />
</template>
