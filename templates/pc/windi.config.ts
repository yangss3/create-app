import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
  important: '#app',
  extract: {
    include: ['src/**/*.{vue,html,tsx,ts}'],
    exclude: ['node_modules', '.git']
  }
})
