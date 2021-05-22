<template>
  <div class="h-full text-center pt-10 dark:bg-gray-800">
    <img alt="Vue logo" src="./assets/logo.png" class="mx-auto">
    <HelloWorld
      msg="A starter template based on Vite 2 and Vue 3 with a rich of features"
    />
    <p class="space-x-4 mt-5">
      <span class="text-blue-500 text-xl">{{ t('hello') }}</span>
      <button class="btn" @click="switchLocale">
        <ion:language class="mr-1" />
        {{ locale === 'zh' ? 'English' : '中文' }}
      </button>
      <span class="text-2xl cursor-pointer" @click="toggleDark">
        <ic:outline-wb-sunny v-if="isDark" class="text-gray-200" />
        <uil:moon v-else class="text-gray-800" />
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

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from '@yangss/vue3-i18n'
import { useDark, useToggle } from '@vueuse/core'

export default defineComponent({
  name: 'App',
  setup: () => {
    const { t, locale } = useI18n()

    function switchLocale () {
      locale.value = locale.value === 'zh' ? 'en' : 'zh'
    }

    const isDark = useDark()
    const toggleDark = useToggle(isDark)

    return {
      switchLocale,
      locale,
      isDark,
      toggleDark,
      t
    }
  }
})
</script>
