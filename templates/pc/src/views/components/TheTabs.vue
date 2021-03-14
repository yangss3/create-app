<template>
  <div class="flex px-8">
    <a-tabs
      v-model:activeKey="activeKey"
      hide-add
      type="editable-card"
      size="small"
      class="flex-1"
      @edit="closeTab"
      @change="changeTab"
    >
      <a-tab-pane
        v-for="pane in panes"
        :key="pane.key"
        :tab="pane.title"
        :closable="!(panes.length === 1 && pane.key === '/')"
      />
    </a-tabs>
    <div class="px-2 flex items-center justify-center">
      <a-dropdown>
        <vaadin:ellipsis-dots-h class="clicked-icon" />
        <template #overlay>
          <a-menu @click="handleMore">
            <a-menu-item key="close-others">{{
              $t('close-other-tabs')
            }}</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { defineComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Pane {
  key: string
  title: string
}

export default defineComponent({
  name: 'TheTabs',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const panes = ref([] as Pane[])

    // 激活tab页
    const activeKey = ref('')
    const activateTab = (key: string) => {
      const tab = panes.value.find((tab) => tab.key === key)
      if (tab) {
        activeKey.value = key
      } else {
        activeKey.value = key
        panes.value.push({
          key,
          title: store.getters.menuRoutesMap[key]?.title
        })
      }
    }

    // 切换tab页
    const changeTab = (key: string) => {
      if (key !== route.path) {
        router.push(key)
      }
    }

    // 关闭tab页
    const closeTab = (key: string) => {
      if (key === activeKey.value) {
        const tabIndex = panes.value.findIndex((tab) => tab.key === key)
        if (tabIndex < panes.value.length - 1) {
          const nextTab = panes.value[tabIndex + 1]
          router.push(nextTab.key)
        } else if (panes.value.length > 1) {
          const prevTab = panes.value[tabIndex - 1]
          router.push(prevTab.key)
        } else {
          router.push('/')
        }
        panes.value.splice(tabIndex, 1)
      } else {
        panes.value = panes.value.filter((tab) => tab.key !== key)
      }
    }

    // 关闭其它tab页
    const closeOtherTabs = () => {
      panes.value = panes.value.filter((tab) => tab.key === activeKey.value)
    }

    const handleMore = ({ key }: { key: string }) => {
      if (key === 'close-others') {
        closeOtherTabs()
      }
    }

    watch(
      () => store.state.menus,
      () => {
        panes.value = panes.value.map((p) => ({
          key: p.key,
          title: store.getters.menuRoutesMap[p.key]?.title
        }))
      }
    )

    // 监听页面路径变化
    watch(
      () => route.path,
      (val) => {
        activateTab(val)
      },
      { immediate: true }
    )

    return {
      activeKey,
      panes,
      changeTab,
      closeTab,
      handleMore
    }
  }
})
</script>

<style lang="postcss" scoped>
::v-deep(.ant-tabs-bar) {
  @apply border-b-0 mb-0;
}
</style>
