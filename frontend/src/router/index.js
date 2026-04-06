import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guest: true}
  },
  {
    path: '/dashboard',
    name : 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if(to.meta.requiresAuth && !isAuthenticated)
  {
    next('/login')
  }
  else if(to.meta.guest && isAuthenticated)
  {
    next('/dashboard')
  }
  else
  {
    next()
  }
})

export default router