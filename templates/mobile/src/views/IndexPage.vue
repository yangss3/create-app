<template>
  <AppLayout>
    <template #content>
      <router-view v-slot="{ Component }">
        <keep-alive :include="cachedPages">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </template>
    <template #footer>
      <van-tabbar route :fixed="false">
        <van-tabbar-item name="home" icon="home-o" to="/">
          {{ $t('home') }}
        </van-tabbar-item>
        <van-tabbar-item name="workbench" icon="apps-o" to="/workbench">
          {{ $t('workbench') }}
        </van-tabbar-item>
        <van-tabbar-item name="user" icon="friends-o" to="/me">
          {{ $t('me') }}
        </van-tabbar-item>
      </van-tabbar>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import { useCachedPages } from '@/composable/common'
const cachedPages = useCachedPages('IndexPage')
</script>
