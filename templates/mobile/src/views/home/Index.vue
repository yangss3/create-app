<template>
  <TheLayout>
    <TheLayoutHeader>
      <van-nav-bar :title="t('home')" />
    </TheLayoutHeader>
    <TheLayoutContent>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt quis consectetur eos optio tenetur maxime ipsa velit cum dolore, facere, hic dolor nulla? Corrupti et ut repellendus aliquam accusamus? Vero!
    </TheLayoutContent>
  </TheLayout>
</template>

<script lang="ts" setup>
import { useI18n } from '@yangss/vue3-i18n'
const { t } = useI18n()
</script>
