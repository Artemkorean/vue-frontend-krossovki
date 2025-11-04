import './assets/main.css'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {createRouter,createWebHistory} from 'vue-router'
import App from './App.vue';
import { useAuthStore } from './stores/auth.js'

import Home from './pages/Home.vue';
import Index from './pages/Index.vue';
import Favorites from './pages/Favorites.vue';
import Profile from './pages/Profile.vue';
import UserRegister from './pages/UserRegister.vue';
import AdminProfile from './pages/admin/AdminProfile.vue';

const app = createApp(App)
const pinia = createPinia()
const routes = [
  {path:'/', name:'Index',component: Index},
  {path:'/home',name:'Home',component: Home },
  {path:'/favorites',name:'Favorites',component: Favorites },
  {path: '/profile',name: 'Profile',component: Profile},
  {path: '/register',name: 'UserRegister',component: UserRegister},
  {path: '/adminProfile',name: 'AdminProfile',component: AdminProfile}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Получаем store

  // Проверяем, требует ли маршрут администратора
  if (to.meta.requiresAdmin) {
    if (authStore.isAuthenticated && authStore.isAdmin) {
      next();
    } else {
      next({ name: 'Index' });
    }
  }
  // Проверяем, требует ли маршрут аутентификации (не обязательно админ)
  else if (to.meta.requiresAuth) {
     if (authStore.isAuthenticated) {
       next();
     } else {
       next({ name: 'Index' });
     }
  }
  else {
    // Для открытых маршрутов разрешаем
    next();
  }
})

app.use(router)
app.use(pinia)
app.use(autoAnimatePlugin)

app.mount('#app')

const authStore = useAuthStore();
authStore.initializeAuth();
