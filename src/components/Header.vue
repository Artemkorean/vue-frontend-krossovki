<script setup>
  defineProps({
    totalPrice: Number
  })

  const emit = defineEmits(['openDrawer'])
</script>

<template>

  <header class=" flex justify-between border-b border-slate-200 px-10 py-8">

    <router-link to="/">
      <div class="flex items-center gap-4">
      <img src="/logo.png" alt="logo" class=" w-10">
        <div>
          <h2 class=" text-2xl font-bold uppercase"> Vue Sneakers</h2>
          <p class=" text-slate-400"> магазин классных кроссовок</p>
        </div>
      </div>
    </router-link>

    <ul class=" flex items-center gap-10">
      <li @click="() => emit('openDrawer')" class=" flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black">
        <img src="/cart.svg" alt="cart">
        <span>{{ totalPrice }} Руб.</span>
      </li>

      <router-link to="/favorites">
        <li class=" flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black">
          <img src="/heart.svg" alt="heart">
          <span>Избранное</span>
      </li>
      </router-link>

      <router-link to="/profile">
        <li class=" flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black">
          <img src="/profile.svg" alt="profile">
          <span>Профиль</span>
        </li>
      </router-link>
    </ul>
  </header>

</template>
