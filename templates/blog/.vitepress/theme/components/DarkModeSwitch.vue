<template>
  <IconBtn @click="toggle">
    <ri-moon-line v-show="isDark" />
    <ri-sun-line v-show="!isDark" />
  </IconBtn>
</template>

<script setup lang='ts'>
import { useToggle, useDark } from '@vueuse/core'
const isDark = useDark()
const toggle = () => useToggle(isDark)()
</script>
