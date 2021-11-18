<template>
  <AppLayout>
    <template #header>
      <div class="h-130px leading-130px bg-blue-500 px-16px">
        <div>
          <img
            src="https://picsum.photos/100"
            class="h-70px rounded-lg inline-block"
          >
          <span class="ml-12px text-16px font-semibold text-white">
            Nicholas Yang
          </span>
        </div>
      </div>
    </template>
    <template #content>
      <div class="h-full bg-gray-100 pt-10px space-y-32px">
        <van-cell-group>
          <van-cell
            :title="$t('language')"
            is-link
            :value="language"
            @click="show = true"
          >
            <template #icon>
              <ion:language class="relative top-4px mr-4px text-blue-500" />
            </template>
          </van-cell>
        </van-cell-group>
        <div class="px-24px">
          <van-button
            block
            round
            type="primary"
            @click="logout"
          >
            {{ $t('logout') }}
          </van-button>
        </div>
      </div>

      <van-action-sheet
        v-model:show="show"
        :title="$t('select-language')"
        :actions="actions"
        :cancel-text="$t('cancel')"
        close-on-click-action
        @select="switchLanguage"
      />
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import { useI18n } from '@yangss/vue3-i18n'
import { useStore } from '@/store'

const show = ref(false)
const actions = ref([
  { name: '中文', id: 'zh' },
  { name: 'English', id: 'en' }
])

const { locale } = useI18n()
const language = ref('')

watchEffect(() => {
  switch (locale.value) {
    case 'zh':
      language.value = '中文'
      break
    case 'en':
      language.value = 'English'
      break
  }
})

const store = useStore()

function switchLanguage ({ id }: typeof actions.value[number]) {
  locale.value = id
  store.updateLocale(id)
}

const router = useRouter()

function logout () {
  router.replace('/login')
}
</script>
