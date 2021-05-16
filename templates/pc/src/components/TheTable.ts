/**
 *  重新封装 Table 组件
 *  支持自适应高度
 *  支持选择行的双向绑定：v-model:selectedRows
 */
import { Table } from 'ant-design-vue'
import { defineComponent, h, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { useI18n } from '@yangss/vue3-i18n'
import { random } from 'lodash-es'
import './TheTable.css'

export default defineComponent({
  name: 'TheTable',
  props: {
    ...Table.props,
    adaptive: {
      type: Boolean,
      default: true
    },
    fixedHeight: {
      type: Boolean,
      default: false
    },
    offsetTop: {
      type: Number,
      default: 260
    },
    selectedRows: Array, // v-model:selectedRows
    multipleSelect: {
      type: Boolean,
      default: true
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    shadow: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:selectedRows'],
  setup (props, { attrs, slots, emit }) {
    const tableHeight = ref()
    const setTableHeight = () => {
      tableHeight.value = window.innerHeight - props.offsetTop
    }
    const uniqueId = '__' + random(100000000, 999999999)

    onMounted(() => {
      if (props.adaptive) {
        setTableHeight()
        window.addEventListener('resize', setTableHeight)
        const table: HTMLElement = document.querySelector(
          `.adaptive-table.ant-table-wrapper.${uniqueId}`
        )!
        table && (table.style.height = `calc(100vh - ${props.offsetTop - 110}px)`)
      }
    })

    watchEffect(() => {
      const table: HTMLElement = document.querySelector(
          `.adaptive-table.ant-table-wrapper.${uniqueId}`
      )!
      table && (table.style.height = `calc(100vh - ${props.offsetTop - 110}px)`)
    })

    onBeforeUnmount(() => {
      if (props.adaptive) {
        window.removeEventListener('resize', setTableHeight)
      }
    })

    const { t } = useI18n()

    return () =>
      h(
        Table,
        {
          ...props,
          ...attrs,
          size: props.size === 'default' ? 'middle' : props.size,
          scroll: props.adaptive ? { y: tableHeight.value } : props.scroll,
          pagination:
            props.pagination === false
              ? false
              : {
                  defaultPageSize: 20,
                  showSizeChanger: true,
                  showTotal: (total: number) =>
                    `${t('pagination.total')} ${total} ${t(
                      'pagination.item'
                    )}`,
                  ...props.pagination
                },
          rowSelection: props.selectedRows
            ? {
                selectedRowKeys: props.selectedRows.map(
                  (row: any) => row[props.rowKey]
                ),
                onChange: (keys: string[], rows: any[]) =>
                  emit('update:selectedRows', rows),
                type: props.multipleSelect ? 'checkbox' : 'radio'
              }
            : props.rowSelection,
          class:
            props.adaptive && props.fixedHeight
              ? `adaptive-table ${uniqueId} ${props.shadow ? 'shadow' : ''}`
              : `${props.shadow ? 'shadow' : ''}`
        },
        slots
      )
  }
})
