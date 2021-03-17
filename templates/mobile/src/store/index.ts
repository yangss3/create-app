import { createStore, Store, useStore as baseUseStore } from 'vuex'
import state, { State } from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import { InjectionKey } from 'vue'

const store = createStore({
  strict: true,
  state,
  getters,
  mutations,
  actions
})

export const storeKey: InjectionKey<Store<State>> = Symbol('store')

export function useStore() {
  return baseUseStore(storeKey)
}

export default store
