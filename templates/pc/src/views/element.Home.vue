<template>
  <HelloWorld :msg="msg" />
  <ul class="space-y-3 mx-auto mt-5">
    <li>
      <vscode-icons:file-type-vue />
      <a href="https://v3.vuejs.org" target="_blank">Vue 3.x</a>
    </li>
    <li>
      <vscode-icons:file-type-vue />
      <a href="https://next.router.vuejs.org" target="_blank">Vue Router 4.x</a>
    </li>
    <li>
      <vscode-icons:file-type-vite />
      <a href="https://vitejs.dev" target="_blank">Vite 2.x</a>
    </li>
    <li>
      <vscode-icons:file-type-typescript-official />
      <a href="https://www.typescriptlang.org" target="_blank">TypeScript</a>
    </li>
    <li>
      <bx:bxs-component class="text-blue-400" />
      <a href="https://element-plus.org/#/zh-CN" target="_blank">Element Plus</a>
    </li>
    <li>
      <file-icons:windi class="text-blue-300" />
      <a href="https://windicss.org" target="_blank">
        vite-plugin-windicss for WindiCSS
      </a>
    </li>
    <li>
      <clarity:plugin-solid class="text-orange-400" />
      <a href="https://github.com/antfu/unplugin-vue-components" target="_blank">
        unplugin-vue-components for component auto importing
      </a>
    </li>
    <li>
      <mdi:emoticon class="text-yellow-500" />
      <a href="https://github.com/antfu/unplugin-icons" target="_blank">
        unplugin-icons for icons
      </a>
    </li>
    <li>
      <ion:language class="text-indigo-400" />
      <a href="https://github.com/yangss3/vue3-i18n" target="_blank">I18n</a>
    </li>
    <li>
      <mdi:theme-light-dark class="text-blue-500" />
      <a>Drak mode</a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const msg = ref('Vue 3 + Vite 2 + Element Plus + TypeScript + WindiCSS')
</script>

<style lang="postcss" scoped>
ul > li {
  @apply flex items-center;
  & > svg {
    @apply mr-4 w-6 h-6;
  }
  & a {
    @apply text-gray-800 dark:(text-gray-200) text-lg hover:text-blue-500;
  }
}
</style>
