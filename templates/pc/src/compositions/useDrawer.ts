import {
  computed,
  reactive,
  watch,
  toRaw,
  ref,
  WritableComputedRef,
  Ref
} from 'vue'
import { cloneDeep, merge } from 'lodash-es'
import { useForm } from '@ant-design-vue/use'
import { validateInfo } from '@ant-design-vue/use/lib/useForm'
import { RuleFunc, Rule } from '@/utils/types'


export interface DrawerProps<T = any> {
  visible: boolean
  title: string
  type?: string
  data: T
  confirmCb?: (val: any) => Promise<void>
}

export const drawerMixin = {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    type: String,
    data: {
      type: Object,
      default: () => ({})
    },
    confirmCb: Function
  },
  emits: ['update:visible']
}

type CB = () => void
type FormUtils = ReturnType<typeof useForm>
interface R1<T> {
  drawerVisible: WritableComputedRef<boolean>
  state: T
  confirmLoading: Ref<boolean>
  confirm: (p?: any) => Promise<void>
  openCb: (cb: CB) => void
}
interface R2<T, K> extends R1<T> {
  validateInfos: Record<keyof K, validateInfo>
  formUtils: FormUtils
}

/**
 * Drawer内表单的逻辑复用
 * @param props
 * @param emit
 * @param stateRaw 表单初始状态对象
 * @param rulesRaw 表单规则配置对象, 可选
 */
export function useFormState<T extends Record<string, any>>(
  props: DrawerProps<T>,
  emit: (eventName: string, val: any) => void,
  stateRaw: T
): R1<T>
export function useFormState<
  T extends Record<string, any>,
  K extends Partial<Record<keyof T, Rule>>
>(
  props: DrawerProps<T>,
  emit: (eventName: string, val: any) => void,
  stateRaw: T,
  rulesRaw: K
): R2<T, K>
export function useFormState<
  T extends Record<string, any>,
  K extends Partial<Record<keyof T, Rule>>
> (
  props: DrawerProps<T>,
  emit: (eventName: string, val: any) => void,
  stateRaw: T,
  rulesRaw?: K
) {
  const drawerVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
  })
  const confirmLoading = ref(false)
  const state = reactive(cloneDeep(stateRaw))

  for (const key in rulesRaw) {
    if (typeof rulesRaw[key] === 'function') {
      const rule = rulesRaw[key] as RuleFunc
      rulesRaw[key] = rule(state) as any
    }
  }
  const formUtils = rulesRaw
    ? useForm(state as Record<string, any>, reactive(rulesRaw as Record<string, any>))
    : undefined
  let cb: CB

  /**
   * 注册 Modal 打开后的回调函数
   * @param cb 回调函数或回调函数的数组
   * @return void
   */
  function openCb (callback: CB) {
    cb = callback
  }

  watch(drawerVisible, (val) => {
    if (val) {
      confirmLoading.value = false

      // 重置state
      merge(state, cloneDeep(stateRaw))
      // 装载state
      merge(state, cloneDeep(props.data))

      formUtils && formUtils.resetFields(state)

      cb && cb()
    }
  })

  async function confirm (custom?: any) {
    try {
      formUtils && (await formUtils.validate())
      if (props.confirmCb) {
        try {
          confirmLoading.value = true
          await props.confirmCb(toRaw(custom || state))
          confirmLoading.value = false
          drawerVisible.value = false
        } catch (error) {
          confirmLoading.value = false
        }
      } else {
        drawerVisible.value = false
      }
    } catch (err) {
      console.error(err)
    }
  }

  return {
    drawerVisible,
    state,
    confirmLoading,
    validateInfos: formUtils?.validateInfos,
    formUtils: formUtils,
    confirm,
    openCb
  }
}

export function useDrawerState (
  props: DrawerProps<any>,
  emit: (eventName: string, val: any) => void
) {
  const drawerVisible = computed({
    get: () => props.visible,
    set: (val: boolean) => emit('update:visible', val)
  })

  const confirmLoading = ref(false)
  let cb: CB
  function openCb (callback: CB) {
    cb = callback
  }

  watch(drawerVisible, (val) => {
    if (val) {
      confirmLoading.value = false
      cb && cb()
    }
  })

  async function confirm (custom?: any) {
    if (props.confirmCb) {
      try {
        confirmLoading.value = true
        await props.confirmCb(custom)
        confirmLoading.value = false
        drawerVisible.value = false
      } catch (error) {
        confirmLoading.value = false
      }
    } else {
      drawerVisible.value = false
    }
  }

  return {
    drawerVisible,
    confirmLoading,
    confirm,
    openCb
  }
}

export function useDrawerController<T = any> () {
  const drawer = reactive<DrawerProps<T>>({
    visible: false,
    title: '',
    type: 'add',
    data: {} as T,
    confirmCb: (() => {}) as any
  })

  function openDrawer (title: string, data: any = {}, type?: string) {
    drawer.visible = true
    drawer.title = title
    drawer.type = type
    drawer.data = data
  }

  return {
    drawer,
    openDrawer
  }
}
