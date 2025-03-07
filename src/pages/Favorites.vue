<script setup>
  import {ref,onMounted} from 'vue'
  import axios from 'axios'

  import CardList from '../components/CardList.vue'

  const favorites = ref([])


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
  <h1 class=" text-3xl font-bold mb-8">Mои закладки</h1>

  <CardList :items="favorites" is-favorites/>
</template>
