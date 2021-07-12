import { App, inject, InjectionKey, readonly } from 'vue'
import state from './state'
import * as actions from './actions'

export const store = {
  state: readonly(state),
  ...actions
}

const storeKey: InjectionKey<typeof store> = Symbol('store')

export function createStore () {
  return (app: App) => {
    app.provide(storeKey, store)
  }
}

export function useStore () {
  return inject(storeKey)!
}

export default createStore()
