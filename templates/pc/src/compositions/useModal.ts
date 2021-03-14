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

type OperationType = 'add' | 'edit'

export interface ModalProps<T = any> {
  visible: boolean
  title: string
  type?: OperationType
  data: T
  confirmCb?: (val: unknown) => Promise<void>
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
  openCb: (cb: CB | CB[]) => void
}
interface R2<T> extends R1<T> {
  validateInfos: FormUtils['validateInfos']
  formUtils: FormUtils
}

/**
 * Modal内表单的逻辑复用
 * @param props
 * @param emit
 * @param stateRaw 表单初始状态对象
 * @param rulesRaw 表单规则配置对象, 可选
 */
export function useFormModalState<T extends object>(
  props: ModalProps<T>,
  emit: (eventName: string, val: any) => void,
  stateRaw: T
): R1<T>
export function useFormModalState<T extends object>(
  props: ModalProps<T>,
  emit: (eventName: string, val: any) => void,
  stateRaw: T,
  rulesRaw: Partial<Record<keyof T, any>>
): R2<T>
export function useFormModalState<T extends object>(
  props: ModalProps<T>,
  emit: (eventName: string, val: any) => void,
  stateRaw: T,
  rulesRaw?: Partial<Record<keyof T, any>>
) {
  const modalVisible = computed({
    get: () => props.visible,
    set: (val: boolean) => emit('update:visible', val)
  })
  const confirmLoading = ref(false)
  const state = reactive(cloneDeep(stateRaw))
  const formUtils = rulesRaw
    ? useForm(state as object, reactive(rulesRaw as object))
    : undefined
  const cbs: CB[] = []

  /**
   * 注册 Modal 打开后的回调函数
   * @param cb 回调函数或回调函数的数组
   * @return void
   */
  function openCb(cb: CB | CB[]) {
    if (Array.isArray(cb)) {
      cbs.push(...cb)
    } else {
      cbs.push(cb)
    }
  }

  watch(modalVisible, (val) => {
    if (val) {
      confirmLoading.value = false

      // 重置state
      merge(state, cloneDeep(stateRaw))
      // 装载state
      merge(state, cloneDeep(props.data))

      formUtils && formUtils.resetFields(state)

      if (cbs.length) {
        cbs.forEach((cb) => cb())
      }
    }
  })

  async function confirm(custom?: any) {
    try {
      formUtils && (await formUtils.validate())
      if (props.confirmCb) {
        try {
          confirmLoading.value = true
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
      console.log(err)
    }
  }

  return {
    modalVisible,
    state,
    confirmLoading,
    validateInfos: formUtils?.validateInfos,
    formUtils: formUtils,
    confirm,
    openCb
  }
}

export function useModalState(
  props: ModalProps<any>,
  emit: (eventName: string, val: any) => void
) {
  const modalVisible = computed({
    get: () => props.visible,
    set: (val: boolean) => emit('update:visible', val)
  })

  const confirmLoading = ref(false)
  const cbs: CB[] = []
  function openCb(cb: CB | CB[]) {
    if (Array.isArray(cb)) {
      cbs.push(...cb)
    } else {
      cbs.push(cb)
    }
  }

  watch(modalVisible, (val) => {
    if (val) {
      confirmLoading.value = false
      if (cbs.length) {
        cbs.forEach((cb) => cb())
      }
    }
  })

  async function confirm(custom?: any) {
    if (props.confirmCb) {
      try {
        confirmLoading.value = true
        await props.confirmCb(custom)
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

export function useModalController<T = any>() {
  const modal = reactive<ModalProps<T>>({
    visible: false,
    title: '',
    type: 'add',
    data: {} as T
  })

  function openModal(type: OperationType, title: string, record: any) {
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
