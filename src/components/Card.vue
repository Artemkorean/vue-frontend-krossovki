<script setup>


defineProps({
  id: Number,
  title :String,
  imageUrl: String,
  price: Number,
  isFavorite: Boolean,
  onClickAdd: Function,
  isAdded: Boolean,
  onClickFavorite: Function
})

</script>

<template>
  <div>
      <div class="relative bg-white border border-slate-100 rounded-3xl p-8 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl">
        <img
          v-if="onClickFavorite"
          :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
          alt="like-1"
          @click="onClickFavorite"
          class="absolute top-8 left-8"
        />
        <img :src="imageUrl" alt="sneaker-1">

        <p class=" mt-2">{{ title }}</p>

        <div class=" flex justify-between mt-5">
          <div class="flex flex-col">
            <span class="text-slate-200">Цена:</span>
            <b>{{ price }} руб.</b>
          </div>

          <img
            v-if="onClickAdd"
            @click="onClickAdd"
            :src="!isAdded ? '/plus.svg' : '/checked.svg'"
            alt="plus"
          />
        </div>
      </div>
  </div>
</template>
