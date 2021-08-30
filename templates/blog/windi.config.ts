import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
  darkMode: 'class',
  attributify: { prefix: 'w:' },
  extract: {
    include: ['**/*.{vue,ts,md}', '.vitepress/**/*.{vue,ts,md}'],
    exclude: ['node_modules', '.git']
  }
})
