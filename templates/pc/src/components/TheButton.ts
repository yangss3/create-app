import { Button } from 'ant-design-vue'
import { defineComponent, resolveComponent, h, VNode, PropType } from 'vue'

const operation = {
  create: 'PlusOutlined',
  delete: 'DeleteOutlined',
  edit: 'EditOutlined',
  view: 'EyeOutlined',
  import: 'ImportOutlined',
  export: 'ExportOutlined',
  search: 'SearchOutlined',
  upload: 'UploadOutlined',
  download: 'DownloadOutlined'
}

export type Operator = keyof typeof operation

export default defineComponent({
  name: 'TheButton',
  props: {
    ...Button.props,
    action: {
      type: String as PropType<Operator>,
      required: true
    }
  },
  setup(props, { slots, attrs }) {
    const btnSlots = {} as {
      default: () => VNode[] | undefined
      icon?: () => VNode
    }

    btnSlots.default = () => slots.default && slots.default()

    btnSlots.icon = () =>
      h(resolveComponent(operation[props.action as Operator]))

    return () =>
      h(
        Button,
        {
          ...props,
          ...attrs
        },
        btnSlots
      )
  }
})
