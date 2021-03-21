<template>
  <TheOperationBar :operations="operations" class="mb-2" />
  <TheTable :columns="columns" :data-source="data" fixed-height>
    <template #operation>
      <span class="space-x-2">
        <a>{{ t('btn.edit') }}</a>
        <a>{{ t('btn.delete') }}</a>
      </span>
    </template>
  </TheTable>
</template>

<script lang="ts">
import { Operation } from '@/components/TheOperationBar'
import { TableColumns } from '@/utils/types'
import { useI18n } from '@yangss/vue3-i18n'
import { defineComponent, ref, computed } from 'vue'

interface User {
  id: string
  username: string
  phone: string
  email: string
}

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const columns = ref<TableColumns<User>>([
      {
        dataIndex: 'username',
        title: computed(() => t('username')),
        align: 'center'
      },
      {
        dataIndex: 'phone',
        title: computed(() => t('phone')),
        align: 'center'
      },
      {
        dataIndex: 'email',
        title: computed(() => t('email')),
        align: 'center'
      },
      {
        dataIndex: 'operation',
        title: computed(() => t('operation')),
        slots: { customRender: 'operation' },
        align: 'center'
      }
    ])
    const data: User[] = [
      {
        id: '1',
        username: 'Nicholas Yang',
        phone: '15922753198',
        email: 'yss_2016@outlook.com'
      }
    ]
    return {
      t,
      columns,
      operations: [
        { action: 'create', callback: () => {} },
        { action: 'delete', callback: () => {} },
        { action: 'edit', callback: () => {} },
        { action: 'view', callback: () => {} },
        { action: 'import', callback: () => {} },
        { action: 'export', callback: () => {} },
        { action: 'upload', callback: () => {} },
        { action: 'download', callback: () => {} },
        { action: 'search', callback: () => {} }
      ] as Operation[],
      data
    }
  }
})
</script>
