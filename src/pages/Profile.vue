<!-- src/pages/Profile.vue -->
<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth.js'
import { useUserStore } from '../stores/user.js';
import { useRouter } from 'vue-router'


const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const user = computed(() => userStore.user);
if (!user.value) {
  router.push('/login');
}


const viewInfo = () => {
  if (!user.value) {
    alert('Пользователь не авторизован');
    return;
  }

  const infoLines = [
    `ID: ${user.value.id}`,
    `Имя пользователя: ${user.value.username || '—'}`,
    `Email: ${user.value.email}`,
    `Роль: ${user.value.role || 'user'}`
  ];

  alert(`👤 Информация о профиле:\n\n${infoLines.join('\n')}`);
};

const editProfile = () => {
  // Логика редактирования (например, переход на страницу редактирования или открытие формы)
  alert('Переход к редактированию профиля');
};

const deleteProfile = () => {
  // Логика удаления (важно: запросить подтверждение!)
  if (confirm('Вы уверены, что хотите удалить свой профиль? Это действие необратимо.')) {
    alert('Профиль удален (заглушка).');
    // Здесь будет логика удаления через API и, возможно, выход из системы
  }
};

const handleLogout = async () => {
  try {
    authStore.logout() // очищает токен, пользователя и localStorage
    router.push('/') // перенаправляем на главную
  } catch (err) {
    console.error('Ошибка при выходе:', err)
  }
}
</script>

<template>
  <div class="min-h-screen  flex justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-800">Привет, {{ user?.username || user?.email || 'пользователь' }}!</h1>
        <!-- <p class="text-gray-500 mt-2">Выберите действие ниже</p> -->
      </div>

      <div class="space-y-3">
        <button
          @click="viewInfo"
          class="w-full py-3 px-4 bg-gray-500 hover:bg-gray-700 text-white font-medium rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
        Просмотреть информацию о профиле
        </button>

        <button
          @click="editProfile"
          class="w-full py-3 px-4 bg-gray-500 hover:bg-gray-700 text-white font-medium rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
        Редактировать профиль
        </button>
        <button
          @click="deleteProfile"
          class="w-full py-3 px-4 bg-gray-500 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
        Удалить профиль
        </button>

        <button
          @click="handleLogout"
          class="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
        Выйти из системы
        </button>
      </div>
    </div>
  </div>
</template>
