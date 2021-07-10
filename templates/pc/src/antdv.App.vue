<template>
  <a-layout class="h-full">
    <a-layout-header class="theme shadow-lg z-1">
      <a-button type="link" @click="$router.push('/')">
        {{ t('home') }}
      </a-button>
      <a-button type="link" @click="$router.push('/about')">
        {{ t('about') }}
      </a-button>
      <span class="icons">
        <span @click="toggleTheme()">
          <ic:outline-wb-sunny v-if="isDark" />
          <ph:moon v-else />
        </span>
        <span @click="switchLocale">
          <uil:letter-chinese-a v-if="locale === 'en'" />
          <ri:english-input v-else />
        </span>
      </span>
    </a-layout-header>
    <a-layout-content class="theme flex flex-col justify-center">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
import { useI18n } from '@yangss/vue3-i18n'
const isDark = useDark()
const toggleTheme = useToggle(isDark)
const { t, locale } = useI18n()
function switchLocale () {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}
</script>

<style lang="postcss" scoped>
.icons {
  @apply absolute right-50px top-20px text-lg cursor-pointer space-x-3;
}
</style>
