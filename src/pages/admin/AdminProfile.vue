<template>
  <div>
    <h1 class="text-center text-3xl text-gray-500">Панель администратора</h1>
    <main class="max-w-2xl mx-auto py-10">
      <div class="bg-white rounded-lg shadow p-8">
        <p>Добро пожаловать в панель администратора!</p>
        <!-- Добавьте сюда содержимое панели администратора -->
        <!-- Например, список пользователей, управление товарами и т.д. -->
      </div>
    </main>
  </div>
</template>

<script setup>
import { useUserStore } from '../../stores/user.js'; // Пример импорта store
const userStore = useUserStore();

</script>
