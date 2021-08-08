<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.animation">
      <keep-alive :include="cachedPages">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import { useCachedPages } from '@/composable/common'
import { useI18n } from '@yangss/vue3-i18n'
import { onMounted } from 'vue'
import { useStore } from './store'
const cachedPages = useCachedPages()
const store = useStore()
const { locale } = useI18n()

onMounted(() => {
  store.loadState()
  locale.value = store.state.locale
})
</script>
