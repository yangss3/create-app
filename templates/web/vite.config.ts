import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import PostCSSPresetEnv from 'postcss-preset-env'
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
  css: {
    postcss: {
      plugins: [PostCSSPresetEnv({ stage: 1 })]
    }
  },
  plugins: [
    vue(),
    WindiCSS(),
    Icons(),
    ViteComponents({
      extensions: ['vue', 'ts', 'tsx'],
      customComponentResolvers: [
        // auto importing icons
        ViteIconsResolver({
          componentPrefix: ''
        })
      ]
    })
  ]
})
