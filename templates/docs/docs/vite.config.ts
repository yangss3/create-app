import { defineConfig } from 'vite'
import ViteComponents from 'vite-plugin-components'
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [
    ViteComponents({
      dirs: ['.vitepress/theme/components'],
      extensions: ['vue', 'js', 'ts'],
      customComponentResolvers: [
        ViteIconsResolver({ componentPrefix: '' })
      ]
    }),
    ViteIcons(),
    WindiCSS()
  ]
})
