<script setup>


defineProps({
  id: Number,
  title :String,
  imageUrl: String,
  price: Number,
  isFavorite: Boolean,
  isFavorites: Boolean,
  isAdded: Boolean,
  onClickAdd: Function,
  onClickRemove: Function,
  onClickFavorite: Function,
  onClickCard: Function
})

</script>

<template>
  <div class="h-full" @click="onClickCard">
    <div class="relative bg-white border border-slate-100 rounded-3xl p-8 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl h-full flex flex-col">
      <img
      v-if="isFavorites"
      src="/close.svg"
      alt="Удалить"
      class="absolute top-2 right-2 w-6 h-6 cursor-pointer opacity-50 hover:opacity-100 z-10"
      @click.stop="onClickRemove"
      />

      <img
        v-if="onClickFavorite"
        :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
        alt="like-1"
        @click.stop="onClickFavorite"
        class="absolute top-8 left-8"
      />
      <div class="mb-4 flex justify-center items-center" style="height: 160px;">
        <img :src="imageUrl" :alt="title" class="max-h-full max-w-full object-contain">
      </div>

      <p class="mt-2 text-sm font-semibold line-clamp-2 min-h-[40px]">{{ title }}</p>

      <div class=" flex justify-between mt-5">
        <div class="flex flex-col">
          <span class="text-slate-200">Цена:</span>
          <b>{{ price }} руб.</b>
        </div>

        <img
          v-if="onClickAdd"
          @click.stop="onClickAdd"
          :src="!isAdded ? '/plus.svg' : '/checked.svg'"
          alt="plus"
        />
      </div>
    </div>
  </div>
</template>
