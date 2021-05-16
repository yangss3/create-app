import { useI18n } from '@yangss/vue3-i18n'
import { Drawer, Button } from 'ant-design-vue'
import { defineComponent, h } from 'vue'
import './TheDrawer.css'

export default defineComponent({
  name: 'TheDrawer',
  props: {
    ...Drawer.props,
    footer: {
      type: Boolean,
      default: true
    },
    confirmLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible', 'confirm', 'opened'],
  setup (props, { attrs, slots, emit }) {
    const { t } = useI18n()
    const afterVisibleChange = (visible: boolean) => {
      if (visible) emit('opened')
      props.afterVisibleChange && props.afterVisibleChange(visible)
    }
    return () =>
      h(
        Drawer,
        {
          getContainer: '#app',
          ...props,
          ...attrs,
          afterVisibleChange
        },
        {
          default: () =>
            h(
              'div',
              {
                class: ['h-full', 'relative', props.footer ? 'pb-56px' : '']
              },
              [
                h(
                  'div',
                  {
                    class: 'h-full overflow-y-auto py-4 px-6'
                  },
                  slots.default && slots.default()
                ),
                props.footer
                  ? h(
                    'div',
                    {
                      class:
                          'absolute inset-x-0 bottom-0 h-56px px-8 border-t leading-14 text-right'
                    },
                    [
                      h(
                        Button,
                        {
                          class: 'smallBtn',
                          onClick: () => emit('update:visible', false)
                        },
                        {
                          default: () => t('btn.cancel')
                        }
                      ),
                      h(
                        Button,
                        {
                          type: 'primary',
                          class: 'smallBtn ml-8px',
                          loading: props.confirmLoading,
                          onClick: () => emit('confirm')
                        },
                        {
                          default: () => t('btn.confirm')
                        }
                      )
                    ]
                  )
                  : undefined
              ]
            )
        }
      )
  }
})
