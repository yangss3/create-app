import type { State } from './state'
import state, { initState } from './state'

export function loadState (newState?: State) {
  if (!newState) {
    try {
      newState = JSON.parse(localStorage.getItem('APP_STATE')!) || initState
    } catch (error) {
      newState = initState
    }
  } else {
    localStorage.setItem('APP_STATE', JSON.stringify(newState))
  }
  Object.assign(state, newState)
}

export function updateLocale (locale: string) {
  loadState({ ...state, locale })
}
