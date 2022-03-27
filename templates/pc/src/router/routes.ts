import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/about',
    component: () => import('@/views/AboutPage.vue')
  }
]

export default routes
