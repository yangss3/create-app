import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import PostCSSPresetEnv from 'postcss-preset-env'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

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
    Vue(),
    // https://github.com/unocss/unocss
    Unocss(),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ['vue', 'tsx', 'ts'],
      dts: './components.d.ts',
      resolvers: [
        // componentResolver
      ]
    }),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue-router'],
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json'
      },
      dts: './auto-imports.d.ts'
    })
  ]
})
