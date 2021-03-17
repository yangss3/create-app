import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import PostCSSPresetEnv from 'postcss-preset-env'
import PostCSSPxToViewport from 'postcss-px-to-viewport'
import ViteComponents from 'vite-plugin-components'
import Icons, { ViteIconsResolver } from 'vite-plugin-icons'
import VantResolver from './src/plugins/vantResolver'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    postcss: {
      plugins: [
        PostCSSPresetEnv({ stage: 1 }),
        PostCSSPxToViewport({ viewportWidth: 375 })
      ]
    }
  },
  plugins: [
    vue(),
    WindiCSS({
      scan: {
        fileExtensions: ['html', 'vue', 'ts', 'tsx']
      }
    }),
    Icons(),
    ViteComponents({
      extensions: ['vue', 'ts'],
      customComponentResolvers: [
        // auto importing icons
        ViteIconsResolver({ componentPrefix: '' }),
        // auto importing vant components
        VantResolver()
      ]
    })
  ]
})
