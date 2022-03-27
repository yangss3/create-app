<script lang="ts" setup>
const msg = ref('Vue 3 + Vite + Ant Design Vue + TypeScript + Unocss')
</script>

<template>
  <HelloWorld :msg="msg" />
  <ul class="space-y-3 mx-auto mt-5">
    <li class="scale-130">
      <a-checkbox checked>
        <a href="https://v3.vuejs.org" target="_blank">Vue 3.x</a>
      </a-checkbox>
    </li>
    <li>
      <a-checkbox checked>
        <a href="https://next.router.vuejs.org" target="_blank">Vue Router 4.x</a>
      </a-checkbox>
    </li>
    <li>
      <a-checkbox checked>
        <a href="https://vitejs.dev" target="_blank">Vite 2.x</a>
      </a-checkbox>
    </li>
    <li>
      <a-checkbox checked>
        <a href="https://www.typescriptlang.org" target="_blank">TypeScript</a>
      </a-checkbox>
    </li>
    <li>
      <a-checkbox checked>
        <a href="https://2x.antdv.com/docs/vue/introduce-cn" target="_blank">Ant Design Vue 3.x</a>
      </a-checkbox>
    </li>
    <li>
      <a-checkbox checked>
        <a href="https:/github.com/unocss/unocss" target="_blank">Unocss</a>
      </a-checkbox>
    </li>
    <li>
      <a-checkbox checked>
        <a href="https://github.com/antfu/unplugin-vue-components" target="_blank">
          unplugin-vue-components
        </a>
      </a-checkbox>
    </li>
    <li>
      <a-checkbox checked>
        <a href="https://github.com/antfu/unplugin-auto-import" target="_blank">
          unplugin-auto-import
        </a>
      </a-checkbox>
    </li>
    <li>
      <a-checkbox checked>
        <a href="https://github.com/yangss3/vue3-i18n" target="_blank">I18n</a>
      </a-checkbox>
    </li>
    <li>
      <a-checkbox checked>
        <a>ESLint</a>
      </a-checkbox>
    </li>
    <li>
      <a-checkbox checked>
        <a>Dark mode</a>
      </a-checkbox>
    </li>
  </ul>
</template>

<style lang="postcss" scoped>
ul > li {
  @apply flex items-center scale-130;
}
</style>
