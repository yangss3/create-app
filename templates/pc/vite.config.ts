import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import PostCSSPresetEnv from 'postcss-preset-env'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

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
    // https://github.com/windicss/vite-plugin-windicss
    WindiCSS(),
    // https://github.com/antfu/unplugin-icons
    Icons(),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ['vue', 'tsx', 'ts'],
      dts: true,
      resolvers: [
        // componentResolver
        IconsResolver({ componentPrefix: '' })
      ]
    })
  ]
})
