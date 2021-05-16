import { State } from './state'
import { Menus, MenuItem, isSubMenu } from '@/utils/types'

function getMenuItems (m: Menus) {
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
  menuRoutesMap (state: State) {
    return getMenuItems(state.menus).reduce<Record<string, MenuItem>>(
      (prev, cur) => {
        prev[cur.path] = cur
        return prev
      },
      {}
    )
  }
}
