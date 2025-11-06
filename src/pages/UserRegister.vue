<template>
  <div>
    <h1 class="text-center text-3xl text-gray-500">Регистрация</h1>
    <main class="max-w-2xl mx-auto py-10">
      <div class="bg-white rounded-lg shadow p-8">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <input
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Введите ваше имя"
              v-model="name"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Создайте пароль"
              v-model="password"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Ваш email"
              v-model="email"
            >
          </div>

          <button class="mt-6 bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-900 transition">
            Зарегистрироваться
          </button>

          <div class="text-center mt-4">
            <span class="text-sm text-gray-600">Уже есть аккаунт?</span>
            <router-link
              to="/index"
              class="text-sm text-blue-600 hover:underline"
            >
              Войти
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
