/// <reference types="vite/client" />
/// <reference types="vite-plugin-icons/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vitepress/theme' {
  const theme: any
  export default theme
}
