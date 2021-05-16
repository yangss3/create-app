import {
  computed,
  reactive,
  watch,
  toRaw,
  ref,
  WritableComputedRef,
  Ref,
  ComputedRef
} from 'vue'
import { cloneDeep, merge } from 'lodash-es'
import { useForm } from '@ant-design-vue/use'
import { validateInfo } from '@ant-design-vue/use/lib/useForm'
import { RuleFunc, Rule } from '@/utils/types'

export interface ModalProps<T = any> {
  visible: boolean
  title: string
  type?: string
  data: T
  confirmCb?: (p?: any) => Promise<void>
}

export const modalMixin = {
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
  modalVisible: WritableComputedRef<boolean>
  state: T
  confirmLoading: Ref<boolean>
  confirm: (p?: any) => Promise<void>
  openCb: (cb: CB) => void
  footer: ComputedRef<'footer' | null>
}
interface R2<T, K> extends R1<T> {
  validateInfos: Record<keyof K, validateInfo>
  formUtils: FormUtils
}

/**
 * Modal内表单的逻辑复用
 * @param props
 * @param emit
 * @param stateRaw 表单初始状态对象
 * @param rulesRaw 表单规则配置对象, 可选
 */
export function useFormState<T extends Record<string, any>>(
  props: ModalProps<T>,
  emit: (eventName: string, val: any) => void,
  stateRaw: T
): R1<T>
export function useFormState<
  T extends Record<string, any>,
  K extends Partial<Record<keyof T, Rule>>
>(
  props: ModalProps<T>,
  emit: (eventName: string, val: any) => void,
  stateRaw: T,
  rulesRaw: K
): R2<T, K>
export function useFormState<
  T extends Record<string, any>,
  K extends Partial<Record<keyof T, Rule>>
> (
  props: ModalProps<T>,
  emit: (eventName: string, val: any) => void,
  stateRaw: T,
  rulesRaw?: K
) {
  const modalVisible = computed({
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

  watch(modalVisible, (val) => {
    if (val) {
      confirmLoading.value = false

      // 重置state
      merge(state, cloneDeep(stateRaw))
      // 合并props.data 到 state
      merge(state, cloneDeep(props.data))

      formUtils && formUtils.resetFields(state)
      cb && cb()
    }
  })

  async function confirm (custom?: any) {
    try {
      formUtils && (await formUtils.validate())
      if (props.confirmCb) {
        confirmLoading.value = true
        try {
          await props.confirmCb(toRaw(custom || state))
          confirmLoading.value = false
          modalVisible.value = false
        } catch (error) {
          confirmLoading.value = false
        }
      } else {
        modalVisible.value = false
      }
    } catch (err) {
      console.error(err)
    }
  }

  return {
    modalVisible,
    state,
    confirmLoading,
    validateInfos: formUtils?.validateInfos,
    formUtils: formUtils,
    confirm,
    openCb,
    footer: computed(() => (props.type === 'view' ? 'footer' : null))
  }
}

//
export function useModalState (
  props: ModalProps<any>,
  emit: (eventName: string, val: any) => void
) {
  const modalVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
  })

  const confirmLoading = ref(false)

  let cb: CB
  function openCb (callback: CB) {
    cb = callback
  }

  watch(modalVisible, (val) => {
    if (val) {
      confirmLoading.value = false
      cb && cb()
    }
  })

  async function confirm (custom?: any) {
    if (props.confirmCb) {
      confirmLoading.value = true
      try {
        await props.confirmCb(toRaw(custom))
        confirmLoading.value = false
        modalVisible.value = false
      } catch (error) {
        confirmLoading.value = false
      }
    } else {
      modalVisible.value = false
    }
  }

  return {
    modalVisible,
    confirmLoading,
    confirm,
    openCb
  }
}

export function useModalController<T = any> () {
  const modal = reactive<ModalProps<T>>({
    visible: false,
    title: '',
    type: 'add',
    data: {} as T
  })

  function openModal (title: string, record: any, type = '') {
    modal.visible = true
    modal.type = type
    modal.title = title
    modal.data = record
  }

  return {
    modal,
    openModal
  }
}
