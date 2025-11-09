<script setup>
  import{ reactive,watch,ref,onMounted } from 'vue'
  import debounce from 'lodash.debounce';
  import CardList from '../components/CardList.vue';
  import axios from 'axios';
  import {inject} from 'vue';
  import { useItem } from '../composables/useItem';
  import { useFavorite } from '../composables/useFavorites';


  const { fetchAllItems, loading: loadingItems, error: errorItems } = useItem();
  const {cart,addToCart,removeFromCart} = inject('cart')
  const { favorites } = useFavorite();
  const items = ref([])


  const filters = reactive({
    sortBy: 'title',
    searchQuery: ''
  });

  const onClickAddPlus = (item) => {
    if(!item.isAdded){
      addToCart(item)
    } else {
      removeFromCart(item)
    }

  }

  const onChangeSelect = event =>{
    filters.sortBy = event.target.value
  }

  const onChangeSearchInput = debounce((event) =>{
    filters.searchQuery = event.target.value
  },500)

  onMounted(async () => {
    const localCart = localStorage.getItem('cart')
    cart.value = localCart ? JSON.parse(localCart) : []

    const data = await fetchAllItems();

    items.value = data.map(obj => ({
    ...obj,
    isFavorite: favorites.value.has(obj.id), // ✅ проверяем по ID
    favoriteId: favorites.value.has(obj.id) ? obj.id : null,
    isAdded: cart.value.some(cartItem => cartItem.id === obj.id)
  }));
    items.value = items.value.map((item) => ({
      ...item,
      isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
    }))
  })

  watch(cart, () => {
    items.value = items.value.map((item) => ({
      ...item,
      isAdded: false
    }))
  })

  watch(filters, async () => {
  // Перезагружаем товары с новыми фильтрами
    const data = await fetchAllItems();
    items.value = data.map(obj => ({
      ...obj,
      isFavorite: favorites.value.has(obj.id), // ✅ проверяем по ID
      favoriteId: favorites.value.has(obj.id) ? obj.id : null,
      isAdded: cart.value.some(cartItem => cartItem.id === obj.id)
    }));
  });
</script>

<template>

  <div class="flex justify-between items-center">
    <div class="flex gap-4">
      <select @change="onChangeSelect" class="py-2 px-3 border rounded-md outline-none">
        <option value="name">По названию</option>
        <option value="price">По цене(дешевые)</option>
        <option value="-price">по цене(дорогие)</option>
      </select>

      <div class="relative">
        <img
          src="/search.svg"
          alt="search"
          class="absolute left-4 top-3"
        />
        <input @input="onChangeSearchInput"
          class="border rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
          type="text"
          placeholder="search..."
        />
      </div>
    </div>
  </div>

  <div class="mt-10">
    <!-- Показываем сообщение, если загрузка -->
    <div v-if="loadingItems">Загрузка товаров...</div>

    <!-- Показываем ошибку, если есть -->
    <div v-else-if="errorItems" class="text-red-500">{{ errorItems }}</div>
    <CardList
      v-else
      :items="items"
      @add-to-cart="onClickAddPlus"
    />
  </div>
</template>
