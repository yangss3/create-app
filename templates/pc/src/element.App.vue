<template>
  <el-container class="h-full">
    <el-header class="theme header">
      <el-button type="text" @click="$router.push('/')">
        {{ $t('home') }}
      </el-button>
      <el-button type="text" @click="$router.push('/about')">
        {{ $t('about') }}
      </el-button>
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
    </el-header>
    <el-main class="theme main">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
import { useI18n } from '@yangss/vue3-i18n'
import { useStore } from './store'
const isDark = useDark()
const toggleTheme = useToggle(isDark)
const { locale } = useI18n()
const store = useStore()
function switchLocale () {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  store.updateLocale(locale.value)
}
onMounted(() => {
  store.loadState()
  locale.value = store.state.locale
})
</script>

<style lang="postcss" scoped>
.icons {
  @apply absolute right-50px top-20px text-lg cursor-pointer space-x-3;
}
.header {
  @apply shadow-lg z-1 leading-60px;
}
.main {
  @apply flex flex-col justify-center;
}
</style>
