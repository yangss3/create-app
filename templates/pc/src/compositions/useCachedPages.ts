import { ref } from 'vue'
import { useRouter } from 'vue-router'

// get the components that need to be cached
export default function (routeName?: string) {
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
