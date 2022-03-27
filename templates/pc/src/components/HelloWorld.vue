<script lang="ts" setup>
defineProps<{ msg: string }>()
</script>

<template>
  <h1 class="text-center text-3xl font-bold">
    {{ msg }}
  </h1>
</template>
