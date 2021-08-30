import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import WindiCSS from 'vite-plugin-windicss'
import PostCSSPresetEnv from 'postcss-preset-env'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '.vitepress/theme')
    }
  },
  css: {
    postcss: {
      plugins: [PostCSSPresetEnv({ stage: 1 })]
    }
  },
  plugins: [
    Components({
      dirs: ['.vitepress/theme/components'],
      extensions: ['vue', 'ts'],
      resolvers: [
        IconsResolver({ componentPrefix: '' })
      ],
      dts: true
    }),
    Icons(),
    WindiCSS()
  ]
})
