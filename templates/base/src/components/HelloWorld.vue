<template>
  <h1 class="mx-auto text-2xl font-bold text-gray-700 dark:text-gray-300">
    {{ msg }}
  </h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true
    }
  }
})
</script>
