<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.animation">
      <keep-alive :include="cachedPages">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts">
import useCachedPages from '@/compositions/useCachedPages'
import { defineComponent} from 'vue'

export default defineComponent({
  setup() {
    return {
      cachedPages: useCachedPages()
    }
  }
})
</script>
