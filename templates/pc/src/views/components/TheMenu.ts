import {
  defineComponent,
  h,
  PropType,
  ref,
  resolveComponent,
  VNode,
  watch
} from 'vue'
import { Menu } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { Menus, MenuItem, SubMenu, isSubMenu } from '@/utils/types'
import { useStore } from '@/store'

export default defineComponent({
  name: 'TheMenu',
  props: {
    data: {
      type: Array as PropType<Menus>,
      default: []
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String as PropType<'dark' | 'light'>,
      default: 'light'
    }
  },
  setup(props) {
    const openKeys = ref([] as string[])
    let preOpenedKeys: string[] = []
    watch(
      () => props.collapsed,
      (val) => {
        if (val) {
          preOpenedKeys = openKeys.value
          openKeys.value = []
        } else {
          openKeys.value = preOpenedKeys
        }
      }
    )

    // 监听页面路径变化，菜单联动
    const selectedKeys = ref([] as string[])
    const route = useRoute()
    const store = useStore()
    watch(
      () => route.path,
      (val) => {
        selectedKeys.value = [val]
        const menuItem: MenuItem | undefined = store.getters.menuRoutesMap[val]
        if (menuItem?.parentId) {
          openKeys.value = [menuItem.parentId]
        }
      },
      { immediate: true }
    )

    function createMenuItem(config: MenuItem) {
      const children: VNode[] = []
      if (config.icon) {
        children.push(h(resolveComponent(config.icon)))
      }
      children.push(h('span', config.title))

      return h(Menu.Item, { key: config.path }, { default: () => children })
    }

    function createSubMenu(config: SubMenu) {
      const titleSlots: VNode[] = []
      if (config.icon) {
        titleSlots.push(h(resolveComponent(config.icon)))
      }
      titleSlots.push(h('span', config.title))

      const defaultSlots = config.children.map((item) => {
        if (isSubMenu(item)) {
          return createSubMenu(item)
        } else {
          return createMenuItem(item)
        }
      })
      return h(
        Menu.SubMenu,
        { key: config.id },
        {
          title: () => titleSlots,
          default: () => defaultSlots
        }
      )
    }

    const router = useRouter()

    return () =>
      h(
        Menu,
        {
          selectedKeys: selectedKeys.value,
          openKeys: openKeys.value,
          mode: 'inline',
          theme: props.theme,
          inlineCollapsed: props.collapsed,
          'onUpdate:selectedKeys': (val: string[]) => {
            selectedKeys.value = val
          },
          'onUpdate:openKeys': (val: string[]) => {
            openKeys.value = val
          },
          onClick: (val: any) => {
            router.push(val.key)
          },
          onOpenChange: (keys: string[]) => {
            openKeys.value = keys.length ? [keys.pop()!] : []
          }
        },
        {
          default: () =>
            props.data.map((item) => {
              if (isSubMenu(item)) {
                return createSubMenu(item)
              } else {
                return createMenuItem(item)
              }
            })
        }
      )
  }
})
