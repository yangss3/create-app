import { App } from 'vue'
import * as components from './comps'

export default (app: App) => {
  Object.values(components).forEach((component) => {
    if (component.displayName) {
      app.component(component.displayName, component)
    } else {
      app.use(component as any)
    }
  })
}
