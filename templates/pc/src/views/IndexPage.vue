<template>
  <a-layout class="h-full">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      :width="230"
      theme="light"
      breakpoint="lg"
      class="shadow-lg"
    >
      <div class="theme flex flex-col h-full">
        <!-- logo -->
        <div class="center-box h-16 overflow-hidden">
          <whh:circlegithub :class="['text-2xl', { 'mr-3': !collapsed }]" />
          <octicon:logo-github-16 v-show="!collapsed" class="text-7xl icon" />
        </div>
        <TheMenu
          :collapsed="collapsed"
          :data="menus"
          class="flex-1 h-0 overflow-y-auto overflow-x-hidden"
        />
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="relative theme shadow-md">
        <span
          class="cursor-pointer text-2xl absolute top-4 left-10"
          @click="collapsed = !collapsed"
        >
          <ri:menu-unfold-fill v-if="collapsed" />
          <ri:menu-fold-fill v-else />
        </span>
        <TheNavBar />
      </a-layout-header>
      <a-layout-content class="relative flex flex-col dark:bg-gray-700">
        <!-- <TheTabs class="theme shadow-md z-1000" /> -->
        <div class="p-2 flex-1 h-0 overflow-y-auto">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import TheMenu from './components/TheMenu'
import TheNavBar from './components/TheNavBar.vue'
import TheTabs from './components/TheTabs.vue'
import { Menus, User } from '@/utils/types'
import { http } from '@/service'
import { useStore } from '@/store'

const collapsed = ref(false)

const store = useStore()

onMounted(async () => {
  const menus = await http.get<Menus>('menus')
  store.commit('UPDATE_MENUS', menus)

  const user = await http.get<User>('user', {
    username: store.state.username
  })
  store.commit('UPDATE_USER', user)
})

const menus = computed(() => store.state.menus)
</script>
