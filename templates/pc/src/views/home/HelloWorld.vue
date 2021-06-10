<template>
  <TheOperationBar :operations="operations" class="mb-2" />
  <TheTable :columns="columns" :data-source="data" fixed-height>
    <template #operation>
      <span class="space-x-2">
        <a @click="drawerVisible = true">{{ t('btn.edit') }}</a>
        <a>{{ t('btn.delete') }}</a>
      </span>
    </template>
  </TheTable>
  <TheDrawer
    v-model:visible="drawerVisible"
    title="Drawer"
    :width="500"
  >
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero expedita dicta sunt perspiciatis? Recusandae consequatur maxime qui accusantium, optio autem sint quibusdam ex esse natus soluta numquam, tempora nobis pariatur.
  </TheDrawer>
  <TheModal
    v-model:visible="modalVisible"
    title="Modal"
    :width="700"
  >
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi asperiores soluta blanditiis necessitatibus et nisi debitis aspernatur ab aperiam. Ipsa, quis est ab suscipit unde tempore dolore voluptas fuga assumenda.
  </TheModal>
</template>

<script lang="ts" setup>
import { Operation } from '@/components/TheOperationBar'
import { TableColumns } from '@/utils/types'
import { useI18n } from '@yangss/vue3-i18n'
import { ref, computed } from 'vue'

interface User {
  id: string
  username: string
  phone: string
  email: string
}


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

const drawerVisible = ref(false)
const modalVisible = ref(false)

const operations = [
  { action: 'create', callback: () => { modalVisible.value = true } },
  { action: 'delete', callback: () => {} },
  { action: 'edit', callback: () => {} },
  { action: 'view', callback: () => {} },
  { action: 'import', callback: () => {} },
  { action: 'export', callback: () => {} },
  { action: 'upload', callback: () => {} },
  { action: 'download', callback: () => {} },
  { action: 'search', callback: () => {} }
] as Operation[]
</script>
