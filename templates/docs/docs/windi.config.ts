import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
  darkMode: 'class',
  attributify: { prefix: 'w:' },
  extract: {
    include: ['**/*.{vue,html,js,ts,md}', '.vitepress/**/*.{vue,html,js,ts,md}'],
    exclude: ['node_modules', '.git']
  }
})
