<template>
  <TheLayout>
    <TheLayoutHeader>
      <van-nav-bar :title="t('workbench')"></van-nav-bar>
    </TheLayoutHeader>
    <TheLayoutContent>
      Workbench
    </TheLayoutContent>
  </TheLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from '@yangss/vue3-i18n'
export default defineComponent({
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  }
})
</script>