import { useI18n } from '@yangss/vue3-i18n'
import { defineComponent, h, PropType, resolveComponent } from 'vue'
import TheButton, { Operator } from './TheButton'

export interface Operation {
  action: Operator
  callback: (...arg: any[]) => void
  name?: string
  type?: 'primary' | 'danger' | 'link' | 'dashed'
}

export default defineComponent({
  name: 'TheOperationBar',
  props: {
    operations: {
      type: Array as PropType<Operation[]>,
      default: () => []
    },
    searchable: {
      type: Boolean,
      default: false
    },
    searchPlaceholder: String,
    searchKeyword: String
  },
  emits: ['update:searchKeyword', 'search'],
  setup(props, { emit, attrs, slots }) {
    const { t } = useI18n()
    const operations = props.operations.map((btn) => {
      return h(
        TheButton,
        {
          action: btn.action,
          onClick: () => btn.callback(),
          type: btn.type
        },
        { default: () => btn.name || t(`btn.${btn.action}`) }
      )
    })

    if (slots.append) {
      operations.push(...slots.append!())
    }

    return () =>
      h(
        'div',
        {
          ...attrs,
          class: 'theme flex items-center justify-between rounded shadow p-2'
        },
        [
          h('div', { class: 'space-x-2 flex items-center' }, operations),
          props.searchable
            ? h(resolveComponent('a-input-search'), {
                class: 'w-56 xl:w-72',
                placeholder: props.searchPlaceholder,
                value: props.searchKeyword,
                'onUpdate:value': (val: string) =>
                  emit('update:searchKeyword', val),
                onSearch: (val: string) => emit('search', val)
              })
            : undefined
        ]
      )
  }
})
