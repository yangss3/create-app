import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    alias: '/',
    name: 'HomePage',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/about',
    name: 'AboutPage',
    component: () => import('@/views/AboutPage.vue')
  }
]

export default routes
