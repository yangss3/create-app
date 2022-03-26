<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark)
const msg = ref('A starter template based on Vite and Vue 3 with a rich of features')
</script>

<template>
  <div class="h-full text-center pt-10 dark:bg-gray-800">
    <img alt="Vue logo" src="./assets/logo.png" class="mx-auto">
    <HelloWorld
      :msg="msg"
    />
    <p class="space-x-4 mt-5">
      <span class="text-4xl cursor-pointer dark:text-white" @click="() => toggleDark()">
        <i v-if="isDark" class="i-carbon:sun" />
        <i v-else class="i-carbon:moon" />
      </span>
    </p>
    <div class="mt-10 text-center space-x-5">
      <router-link to="/home">
        Home
      </router-link>
      <router-link to="/about">
        About
      </router-link>
    </div>
    <router-view />
  </div>
</template>

