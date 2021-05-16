import { Modal, Spin } from 'ant-design-vue'
import { defineComponent, h, PropType } from 'vue'

export default defineComponent({
  name: 'TheModal',
  props: {
    ...Modal.props,
    minHeight: {
      type: [Number, String] as PropType<'number' | 'string'>
    },
    okBtnDisabled: {
      type: Boolean,
      default: false
    },
    contentLoading: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { attrs, slots }) {
    return () =>
      h(
        Modal,
        {
          ...props,
          ...attrs,
          bodyStyle: {
            minHeight:
              typeof props.minHeight === 'number'
                ? `${props.minHeight}px`
                : props.minHeight,
            maxHeight: props.footer === null ? '83vh' : '75vh',
            overflowY: 'auto',
            ...props.bodyStyle
          },
          okButtonProps: {
            ...props.okButtonProps,
            disabled: props.okBtnDisabled
          },
          centered: true,
          maskClosable: false,
          getContainer: () => document.querySelector('#app')
        },
        {
          ...slots,
          default: props.contentLoading
            ? () => h('div', { class: 'h-200px center-box' }, [h(Spin)])
            : slots.default
        }
      )
  }
})
