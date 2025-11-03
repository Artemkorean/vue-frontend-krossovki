<template>
  <div>
    <h1 class="text-center text-3xl text-gray-500">Вход</h1>
    <main class="max-w-2xl mx-auto py-10">
      <div class="bg-white rounded-lg shadow p-8">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Введите пароль"
              v-model="password"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="your@email.com"
              v-model="email"
            >
          </div>

          <button class="mt-6 bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-900 transition">
            Войти
          </button>

          <div class="text-center mt-4">
            <span class="text-sm text-gray-600">Ещё нет аккаунта? </span>
            <router-link
              to="/register"
              class="text-sm text-blue-600 hover:underline"
            >
              Зарегистрироваться
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
