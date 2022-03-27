<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
import { useI18n } from '@yangss/vue3-i18n'
const isDark = useDark()
const toggleTheme = useToggle(isDark)
const { locale } = useI18n()
const language = ref([locale.value])

function switchLocale({ key }: any) {
  locale.value = key
  language.value = [key]
  localStorage.setItem('APP_LOCALE', key)
}

onMounted(() => {

})
</script>

<template>
  <a-layout class="theme h-full">
    <a-layout-header class="theme shadow-lg z-1 flex items-center justify-between">
      <span class="links">
        <a-button type="link" @click="$router.push('/')">
          {{ $t('home') }}
        </a-button>
        <a-button type="link" @click="$router.push('/about')">
          {{ $t('about') }}
        </a-button>
      </span>
      <span class="icons">
        <span @click="toggleTheme()">
          <i v-if="isDark" class="i-carbon-sun" />
          <i v-else class="i-carbon-moon" />
        </span>
        <a-dropdown :trigger="['click']">
          <i class="i-carbon-translate" />
          <template #overlay>
            <a-menu
              :selected-keys="language"
              :theme="isDark ? 'dark' : 'light'"
              @click="switchLocale"
            >
              <a-menu-item key="zh-CN">
                简体中文
              </a-menu-item>
              <a-menu-item key="en-US">
                English
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </span>
    </a-layout-header>
    <a-layout-content class="flex flex-col justify-center">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </a-layout-content>
  </a-layout>
</template>


<style lang="postcss" scoped>
.icons {
  @apply text-lg cursor-pointer space-x-3;
}
</style>
