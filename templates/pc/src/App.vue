<template>
  <a-config-provider :locale="langPkg">
    <router-view v-slot="{ Component }">
      <keep-alive :include="cachedPages">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </a-config-provider>
</template>

<script lang="ts">
import enUS from 'ant-design-vue/es/locale/en_US'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
import useCachedPages from '@/compositions/useCachedPages'
import { defineComponent, ref, watchEffect } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  setup () {
    const store = useStore()
    const langPkg = ref(enUS as any)
    watchEffect(() => {
      if (store.state.locale === 'zh') {
        moment.locale('zh')
        langPkg.value = zhCN
      } else {
        moment.locale('en')
        langPkg.value = enUS
      }
    })
    return {
      cachedPages: useCachedPages(),
      langPkg
    }
  }
})
</script>
