<template>
  <Layout>
    <template #navbar-search>
      <div class="flex space-x-5 ml-5">
        <DarkModeSwitch />
      </div>
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme
</script>
