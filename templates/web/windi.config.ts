// https://windicss.org/integrations/vite.html
import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
  darkMode: 'class',
  attributify: { prefix: 'w' },
  extract: {
    include: ['src/**/*.{vue,html,tsx,ts}'],
    exclude: ['node_modules', '.git']
  }
})
