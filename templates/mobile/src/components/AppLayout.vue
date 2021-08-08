<template>
  <div class="app-layout">
    <header v-if="$slots.header" class="app-layout-header">
      <slot name="header" />
    </header>
    <main v-if="$slots.content" class="app-layout-content">
      <slot name="content" />
    </main>
    <footer v-if="$slots.footer" class="app-layout-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style lang="postcss" scoped>
.app-layout {
  @apply flex flex-col h-full relative;
  & .app-layout-header {
    @apply relative;
  }
  & .app-layout-content {
    @apply flex-1 overflow-auto relative;
  }
  & .app-layout-footer {
    @apply relative;
  }
}
</style>
