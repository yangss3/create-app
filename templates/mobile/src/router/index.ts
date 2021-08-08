import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
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
