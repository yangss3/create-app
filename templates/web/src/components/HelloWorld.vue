<template>
  <h1 class="mx-auto text-2xl font-bold text-gray-700 dark:text-gray-300">
    {{ msg }}
  </h1>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
const props = defineProps({
  msg: String
})
</script>
