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
        <span>{{ totalPrice }} pyb</span>
      </li>

      <router-link to="/favorites">
        <li class=" flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black">
          <img src="/heart.svg" alt="heart">
          <span>favorites</span>
      </li>
      </router-link>

      <li class=" flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black">
        <img src="/profile.svg" alt="cart">
        <span>profile</span>
      </li>
    </ul>
  </header>

</template>
