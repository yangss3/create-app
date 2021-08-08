import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'IndexPage',
    component: () => import('@/views/IndexPage.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'home',
        alias: '',
        name: 'Home',
        component: () => import('@/views/home/Index.vue')
      },
      {
        path: 'workbench',
        name: 'Workbench',
        component: () => import('@/views/workbench/Index.vue')
      },
      {
        path: 'me',
        name: 'Me',
        component: () => import('@/views/me/Index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('@/views/LoginPage.vue')
  }
]

export default routes
