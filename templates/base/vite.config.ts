import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import ViteComponents from 'vite-plugin-components'
import Icons, { ViteIconsResolver } from 'vite-plugin-icons'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue(),
    WindiCSS({}),
    Icons(),
    ViteComponents({
      extensions: ['vue', 'ts'],
      customComponentResolvers: [
        // auto importing icons
        ViteIconsResolver({
          componentPrefix: ''
        })
      ]
    })
  ]
})
