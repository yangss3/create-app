import state, { State, initState } from './state'

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
  for (const key in newState) {
    state[key as keyof State] = newState[key as keyof State]
  }
}

export function updateLocale (locale: string) {
  loadState({ ...state, locale })
}
