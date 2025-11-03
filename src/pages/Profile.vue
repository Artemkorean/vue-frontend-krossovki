<!-- src/pages/Profile.vue -->
<script setup>
// Предположим, что информация о пользователе будет получена из хранилища (например, Pinia) или передана через props/запрос
// Здесь используем заглушку для демонстрации
import { ref } from 'vue';

const user = ref({
  id: 1,
  email: 'john@dsff.com', // Используем email из ваших предпочтений
  username: 'JohnDoe'     // Можно добавить имя пользователя
});

// Функции-заглушки для действий
const viewInfo = () => {
  // Логика просмотра информации (например, открытие модального окна)
  alert(`Просмотр информации о пользователе: ${user.value.username || user.value.email}`);
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
</script>

<template>
  <div>
    <h1 class="text-center text-3xl text-gray-500">Профиль</h1>
    <main class="max-w-2xl mx-auto py-10">
      <div class="bg-white rounded-lg shadow p-8">
        <div class="space-y-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-700">Детали профиля</h2>
          <div class="space-y-2">
            <p><span class="font-medium">ID:</span> {{ user.id }}</p>
            <p><span class="font-medium">Email:</span> {{ user.email }}</p>
            <p><span class="font-medium">Имя пользователя:</span> {{ user.username || 'Не установлено' }}</p>
            <!-- Добавьте другие поля профиля по мере необходимости -->
          </div>
        </div>

        <div class="flex flex-col space-y-4">
          <button
            @click="viewInfo"
            class="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition"
          >
            Посмотреть информацию
          </button>

          <button
            @click="editProfile"
            class="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition"
          >
            Изменить профиль
          </button>

          <button
            @click="deleteProfile"
            class="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
          >
            Удалить профиль
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
