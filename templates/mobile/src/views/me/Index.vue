<template>
  <TheLayout>
    <TheLayoutHeader class="h-130px bg-blue-500 px-4">
      <div class="mt-30px">
        <img src="https://picsum.photos/100" class="h-70px rounded-lg inline-block">
        <span class="ml-3 text-lg font-semibold text-white">Nicholas Yang</span>
      </div>
    </TheLayoutHeader>
    <TheLayoutContent class="bg-gray-100 pt-10px">
      <van-cell :title="t('language')" is-link :value="language" @click="show = true">
        <template #icon>
          <ion:language class="relative top-1.3 mr-2 text-blue-500"/>
        </template>
      </van-cell>
      <div class="mt-8 px-5">
        <van-button
          block
          round
          type="primary"
          @click="logout"
        >
          {{t('logout')}}
        </van-button>
      </div>

      <van-action-sheet
        v-model:show="show"
        :title="t('select-language')"
        :actions="actions"
        :cancel-text="t('cancel')"
        close-on-click-action
        @select="switchLanguage"
      />
    </TheLayoutContent>
  </TheLayout>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue'
import { useI18n } from '@yangss/vue3-i18n'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'User',
  setup() {
    const show = ref(false)
    const actions = ref([
      { name: '中文', id: 'zh' },
      { name: 'English', id: 'en' }
    ])

    const  { locale, t } = useI18n()
    const language = ref('')

    function switchLanguage({ id }: { name: string; id: 'zh' | 'en' }) {
      locale.value = id
    }

    watchEffect(() => {
      switch(locale.value) {
        case 'zh':
          language.value = '中文'
          break
        case 'en':
          language.value = 'English'
          break
      }
    })

    const store = useStore()
    const router = useRouter()

    function logout () {
      store.commit('UPDATE_AUTH', null)
      router.replace('/login')
    }

    return {
      show,
      actions,
      language,
      switchLanguage,
      logout,
      t
    }
  }
})
</script>