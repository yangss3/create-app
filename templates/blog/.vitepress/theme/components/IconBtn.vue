<template>
  <button class="icon-button" @click="go">
    <a v-if="href" :href="href" target="_blank">
      <slot />
    </a>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vitepress'
const props = defineProps<{ href?: string, route?: string }>()
const router = useRouter()
const go = () => props.route && router.go(props.route)
</script>

<style scoped lang="postcss">
.icon-button {
  line-height: 0;
  border: 0;
  background: none;
  color: var(--c-text);
  opacity: 0.8;
  cursor: pointer;
  & a {
    color: var(--c-text);
  }
  &:focus {
    outline: none;
  }
  &:hover {
    opacity: 1;
  }
  & svg {
    margin: auto;
  }
}
</style>
