<template>
  <TheLayout>
    <TheLayoutContent>
      <router-view v-slot="{ Component }">
        <keep-alive :include="cachedPages">
          <component :is="Component"/>
        </keep-alive>
      </router-view>
    </TheLayoutContent>
    <TheLayoutFooter>
      <van-tabbar route :fixed="false">
        <van-tabbar-item name="home" icon="home-o" to="/">{{t('home')}}</van-tabbar-item>
        <van-tabbar-item name="workbench" icon="apps-o" to="/workbench">{{t('workbench')}}</van-tabbar-item>
        <van-tabbar-item name="user" icon="friends-o" to="/me">{{t('me')}}</van-tabbar-item>
      </van-tabbar>
    </TheLayoutFooter>
  </TheLayout>
</template>me

<script lang="ts">
import useCachedPages from '@/compositions/useCachedPages'
import { defineComponent } from 'vue'
import { useI18n } from '@yangss/vue3-i18n'
export default defineComponent({
  name: 'IndexPage',
  setup() {
    const { t } = useI18n()
    return {
      cachedPages: useCachedPages('IndexPage'),
      t
    }
  }
})
</script>