import { State } from './state'
import { Menus, MenuItem, isSubMenu } from '@/utils/types'
import router from '@/router'

function getMenuItems(m: Menus) {
  return m.reduce<MenuItem[]>((prev, cur) => {
    if (isSubMenu(cur)) {
      prev.push(...getMenuItems(cur.children))
    } else {
      prev.push(cur)
    }
    return prev
  }, [])
}

export default {
  menuRoutesMap(state: State) {
    return getMenuItems(state.menus).reduce<Record<string, MenuItem>>(
      (prev, cur) => {
        prev[cur.path] = cur
        return prev
      },
      {}
    )
  }

  // disabledMenuRoutes (state, getters) {
  //   if (state.menus.length === 0) {
  //     return []
  //   } else {
  //     const menuRoutes = router.getRoutes().find(
  //       route => route.path === '/' && route.children.length > 0
  //     )!.children

  //     return menuRoutes.filter(route => {
  //       return Object.keys(getters.menuRoutesMap).find(
  //         key =>
  //           route.path === key.slice(1) ||
  //           route.path.split('/')[0] === key.slice(1).split('/')[0]
  //       ) === undefined
  //     }).map(route => route.name)
  //   }
  // }
}
