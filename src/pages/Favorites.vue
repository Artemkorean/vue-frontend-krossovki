<script setup>
  import {ref,onMounted} from 'vue'
  import axios from 'axios'
  import CardList from '../components/CardList.vue'

  const favorites = ref([])

  const fetchFavorites = async () => {
  try {
    const { data } = await axios.get('https://4d52dc6e33fee8ad.mokky.dev/favorites?_relations=items')
    favorites.value = data.map((obj) => obj.item)
  } catch (err) {
    console.log(err)
  }
}

const removeFromFavorites = async (item) => {
  try {
    // Сначала находим ID в таблице избранного
    const { data: favoritesData } = await axios.get(`https://4d52dc6e33fee8ad.mokky.dev/favorites?item_id=${item.id}`)

    if (favoritesData.length > 0) {
      await axios.delete(`https://4d52dc6e33fee8ad.mokky.dev/favorites/${favoritesData[0].id}`)
      favorites.value = favorites.value.filter(fav => fav.id !== item.id)
    }
  } catch (err) {
    console.log('Ошибка при удалении из избранного:', err)
  }
}

onMounted(fetchFavorites)

onMounted(async () => {
  try{
    const {data} = await axios.get('https://4d52dc6e33fee8ad.mokky.dev/favorites?_relations=items')

    favorites.value = data.map((obj) => obj.item)
  } catch(err){
    console.log(err)
  }
})
</script>
<template>
  <h1 class="text-center text-3xl text-gray-500 mb-8">Избранное</h1>
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

  <CardList :items="favorites"
            is-favorites
            @remove-from-favorites="removeFromFavorites"
  />
</template>
