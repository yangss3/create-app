<template>
  <div>{{ msg }}</div>
</template>

<script lang="ts" setup>
defineProps<{ msg: string }>()
</script>