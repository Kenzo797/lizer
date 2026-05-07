import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Layout
import MainLayout from '../layouts/mainLayout.vue'

// Páginas públicas (sem layout)
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

// Páginas protegidas (com layout)
import Dashboard from '../views/DashBoard.vue'
import Categories from '../views/Categories.vue'
import CategoryLinks from '../views/CategoryLinks.vue'
import EditProfile from '@/views/EditProfile.vue'

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
    meta: { guest: true }
  },
  {
    path: '/editprofile',
    name: 'EditProfile',
    component: EditProfile,
    meta: { requiresAuth: true}
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'categories',
        name: 'Categories',
        component: Categories
      },
      {
        path: 'category/:id',
        name: 'CategoryLinks',
        component: CategoryLinks
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }
  
  if (to.meta.guest && isAuthenticated) {
    return '/dashboard'
  }
  
  return true
})

export default router