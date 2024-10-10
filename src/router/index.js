import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/change',
      name: 'change',
      component: () => import('../views/ChangeView.vue')
    },
    {
      path: '/reset',
      name: 'reset',
      component: () => import('../views/ResetView.vue')
    },
    {  
      path: '/create',
      name: 'create',
      component: () => import('../views/CreateView.vue')
    }
  ]
})

export default router