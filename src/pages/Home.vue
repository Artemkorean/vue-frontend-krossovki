<script setup>
  import{ reactive,watch,ref,onMounted } from 'vue'
  import debounce from 'lodash.debounce';
  import CardList from '../components/CardList.vue';
  import axios from 'axios';
  import {inject} from 'vue';
  


  const {cart,addToCart,removeFromCart} = inject('cart')
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

  const addToFavorite = async (item) => {
    try{
      if(!item.isFavorite){
        const obj={
        item_id: item.id,

      }
        item.isFavorite = true

        const { data }= await axios.post('https://4d52dc6e33fee8ad.mokky.dev/favorites',obj);

        item.favoriteId = data.id
      } else{
        item.isFavorite = false;
        await axios.delete(`https://4d52dc6e33fee8ad.mokky.dev/favorites/${item.favoriteId}`)
        item.favoriteId = null;
      }
    } catch(err){
        console.log(err)
    }
  }

  const fetchFavorites = async () => {
    try{
      const { data:favorites }= await axios.get('https://4d52dc6e33fee8ad.mokky.dev/favorites');

      items.value = items.value.map(item => {
        const favorite = favorites.find(favorite => favorite.item_id === item.id);

        if(!favorite){
          return item
        }

        return {
          ...item,
          isFavorite: true,
          favoriteId: favorite.id
        }
      });

      console.log(items.value)
    }catch(err){
      console.log(err)
    }
  }

  const fetchItems = async () => {
    try{
      const params = {
        sortBy: filters.sortBy

      }

      if(filters.searchQuery) {
        params.title = `*${filters.searchQuery}*`;
      }

      const { data }= await axios.get('https://4d52dc6e33fee8ad.mokky.dev/items',{
        params
      } );

      items.value = data.map((obj) => ({
        ...obj,
        isFavorite: false,
        favoriteId:null,
        isAdded: false
      }));
    }catch(err){
      console.log(err)
    }
  }

  onMounted(async () => {
    const localCart = localStorage.getItem('cart')
    cart.value = localCart ? JSON.parse(localCart) : []

    await fetchItems();
    await fetchFavorites()

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

  watch(filters, fetchItems);
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
    <CardList
      :items="items"
      @add-to-favorite="addToFavorite"
      @add-to-cart="onClickAddPlus"
    />
  </div>
</template>
