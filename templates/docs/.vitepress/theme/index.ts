import 'virtual:windi.css'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HelloWorld from '@/components/HelloWorld.vue'
import Layout from '@/components/Layout.vue'
import './style/var.css'
import './style/base.css'
import './style/code.css'

export default <Theme> {
  ...DefaultTheme,
  Layout,
  enhanceApp: ({ app }) => {
    app.component('HelloWorld', HelloWorld)
  }
}
