<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

defineProps({
  totalPrice: Number
})

const route = useRoute();
const emit = defineEmits(['openDrawer'])
const hideNavLinks = computed(() => route.path === '/' || route.path === '/register'|| route.path==='/adminProfile');
//console.log('hideNavLinks:', hideNavLinks);
const isLogoLinkEnabled = computed(() => {
  return route.path !== '/' && route.path !== '/register'&& route.path !=='/adminProfile';
});
</script>

<template>
  <header class=" flex justify-between border-b border-slate-200 px-10 py-8">
    <component
    :is="isLogoLinkEnabled ? 'router-link' : 'div'"
    :to="isLogoLinkEnabled ? '/home' : undefined"
    :class="{ 'pointer-events-none': !isLogoLinkEnabled }"
  >
    <div class="flex items-center gap-4">
      <img src="/logo.png" alt="logo" class="w-10">
      <div>
        <h2 class="text-2xl font-bold uppercase"> Vue Sneakers</h2>
        <p class="text-slate-400"> магазин классных кроссовок</p>
      </div>
    </div>
  </component>

    <ul v-if="!hideNavLinks" class=" flex items-center gap-10">
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
