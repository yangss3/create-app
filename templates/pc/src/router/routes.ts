import { RouteRecordRaw } from 'vue-router'

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
        path: '',
        name: 'UserManagement',
        component: () => import('@/views/home/HelloWorld.vue')
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
