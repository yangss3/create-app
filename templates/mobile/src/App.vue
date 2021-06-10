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
import useCachedPages from '@/compositions/useCachedPages'
const cachedPages = useCachedPages()
</script>
