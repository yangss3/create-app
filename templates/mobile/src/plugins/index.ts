import type { App } from 'vue'

const plugins = import.meta.globEager('./**/index.ts')

export default (app: App) => {
  Object.values(plugins).forEach((plugin) => app.use(plugin.default))
}
