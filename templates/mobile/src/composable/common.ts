import { ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 获取指定父路由下需要缓存的路由的名称
 * @param routeName 父路由的名称, 默认为根路由的名称
 * @returns Ref<string[]> 缓存页面的路由名
 *
 * 用法示例
 * ```html
 * <template>
 *  <router-view v-slot="{ Component }">
 *    <keep-alive :include="cachedPages">
 *      <component :is="Component" />
 *    </keep-alive>
 *  </router-view>
 * </template>
 *
 * <script setup>
 * import { useCachedPages } from '@/composable/common'
 *  const cachedPages = useCachedPages()
 * </script>
 * ```
 */
export function useCachedPages (routeName?: string) {
  const cachedPages = ref([] as string[])
  const router = useRouter()

  if (routeName) {
    const parentRoute = router.getRoutes().find((r) => r.name === routeName)
    if (parentRoute) {
      parentRoute.children.forEach((child) => {
        if (child.meta?.keepAlive) {
          cachedPages.value.push(child.name as string)
        }
      })
    }
  } else {
    router.options.routes.forEach((child) => {
      if (child.meta?.keepAlive) {
        cachedPages.value.push(child.name as string)
      }
    })
  }

  return cachedPages
}
