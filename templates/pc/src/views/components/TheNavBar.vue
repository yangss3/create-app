<template>
  <div class="space-x-5 flex items-center justify-end h-full">
    <!-- Languages -->
    <a-dropdown :trigger="['click']">
      <ion:language class="clicked-icon text-xl" />
      <template #overlay>
        <a-menu :selected-keys="selectedLanguageKey" @click="switchLanguage">
          <a-menu-item v-for="(label, key) in languages" :key="key">
            <span class="text-xl" style="font-size: 1rem">
              <twemoji:flag-for-flag-china v-if="key === 'zh'" />
              <twemoji:flag-for-flag-united-states v-else-if="key === 'en'" />
            </span>
            <span class="ml-2" style="margin-left: 8px">{{ label }}</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <!-- theme -->
    <span class="text-xl cursor-pointer h-6" @click="toggleTheme">
      <ic:outline-wb-sunny v-if="isDark" />
      <uil:moon v-else />
    </span>

    <!-- Avatar -->
    <a-dropdown :trigger="['click']" class="cursor-pointer center-box">
      <span>
        <a-avatar v-if="user.photo" :src="user.photo" size="large" />
        <a-avatar
          v-else
        ><template #icon> <user-outlined /></template></a-avatar>
        <span class="ml-2 font-semibold">{{ user.username }}</span>
      </span>
      <template #overlay>
        <a-menu @click="handleAction">
          <a-menu-item key="profile">
            <uil:user />
            <span style="margin-left: 8px">{{ t('profile') }}</span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="logout">
            <ant-design:logout-outlined />
            <span style="margin-left: 8px">{{ t('logout') }}</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { useStore } from '@/store'
import { locales } from '@/utils/constants'
import { Locale } from '@/utils/types'
import { http } from '@/service'
import { useRouter } from 'vue-router'
import { useI18n } from '@yangss/vue3-i18n'
import { useDark, useToggle } from '@vueuse/core'

type AvatarAction = 'profile' | 'logout'

export default defineComponent({
  name: 'TheNavBar',
  setup () {
    const store = useStore()
    const router = useRouter()

    // Language
    const languages = reactive(locales)
    const selectedLanguageKey = ref([store.state.locale])
    const { locale, t } = useI18n()
    function switchLanguage (p: { key: Locale; keyPath: Locale[] }) {
      locale.value = p.key
      store.commit('UPDATE_LOCALE', p.key)
      selectedLanguageKey.value = p.keyPath
    }

    /* theme */
    const isDark = useDark()
    const toggleTheme = useToggle(isDark)

    async function handleAction (p: { key: AvatarAction }) {
      switch (p.key) {
        case 'logout':
          await http.post('logout')
          router.replace('/login')
          break
        case 'profile':
          break
      }
    }

    return {
      t,
      selectedLanguageKey,
      languages,
      switchLanguage,
      handleAction,
      isDark,
      toggleTheme,
      user: computed(() => store.state.user)
    }
  }
})
</script>
