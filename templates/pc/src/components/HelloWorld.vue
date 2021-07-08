<template>
  <h1
    class="theme"
    w:text="4xl center"
    w:font="bold"
    w:m="b-10"
  >
    {{ msg }}
  </h1>
</template>

<script lang="ts" setup>
defineProps<{ msg: string }>()
</script>
