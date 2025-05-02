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

  <CardList :items="favorites"
            is-favorites
            @remove-from-favorites="removeFromFavorites"
  />
</template>
