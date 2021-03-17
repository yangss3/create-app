import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import store from '@/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// check access permission and verify the token
router.beforeEach((to) => {
  if (to.path !== '/login' && to.meta.requiresAuth) {
    if (!store.state.token) {
      return {
        path: '/login',
        query: { redirect: to.fullPath }
      }
    }
  }
})

// route-based dynamic transition
router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta = to.meta || {}
  if (toDepth > fromDepth) {
    to.meta.animation = 'van-slide-left'
  } else if (toDepth < fromDepth) {
    to.meta.animation = 'van-slide-right'
  } else {
    to.meta.animation = ''
  }
})

export default router
