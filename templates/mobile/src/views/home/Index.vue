<template>
  <TheLayout>
    <TheLayoutHeader>
      <van-nav-bar :title="t('home')"></van-nav-bar>
    </TheLayoutHeader>
    <TheLayoutContent>
     Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt quis consectetur eos optio tenetur maxime ipsa velit cum dolore, facere, hic dolor nulla? Corrupti et ut repellendus aliquam accusamus? Vero!
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