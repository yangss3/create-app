import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import NProgress from '@/plugins/nprogress'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {
  NProgress.start()
})

router.afterEach((to, from) => {
  NProgress.done()
})

export default router
