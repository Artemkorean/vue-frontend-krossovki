<script setup>
  import Card from './Card.vue';

  defineProps({
    items:Array,
    isFavorites:Boolean
})

const emit = defineEmits(['addToFavorites','addToCart','removeFromFavorites'])


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
      :onClickFavorite="isFavorites ? null : () => emit('addToFavorite',item)"
      :onClickAdd="isFavorites ? null : () => emit('addToCart',item)"
      :onClickRemove="isFavorites ? () => emit('removeFromFavorites', item) : null"
      :isFavorite="item.isFavorite"
      :isAdded="item.isAdded"
      :isFavorites="isFavorites"
    />
  </div>
</template>
