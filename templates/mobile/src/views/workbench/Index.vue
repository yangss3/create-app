<template>
  <TheLayout>
    <TheLayoutHeader>
      <van-nav-bar :title="t('workbench')" />
    </TheLayoutHeader>
    <TheLayoutContent>
      Workbench
    </TheLayoutContent>
  </TheLayout>
</template>

<script lang="ts" setup>
import { useI18n } from '@yangss/vue3-i18n'
const { t } = useI18n()
</script>
