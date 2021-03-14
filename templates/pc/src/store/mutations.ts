import { Locale, Auth, Menus, User } from '@/utils/types'
import { State } from './state'

export default {
  UPDATE_AUTH(state: State, payload?: Auth | null) {
    if (payload) {
      state.token = payload.token
      state.username = payload.username
      localStorage.setItem(
        'APP_AUTH',
        JSON.stringify({
          token: payload.token,
          username: payload.username
        })
      )
    } else {
      state.token = ''
      state.username = ''
      localStorage.removeItem('APP_AUTH')
    }
  },

  UPDATE_LOCALE(state: State, locale: Locale) {
    state.locale = locale
    localStorage.setItem('APP_LOCALE', locale)
  },

  UPDATE_MENUS(state: State, menus: Menus) {
    state.menus = menus
  },

  UPDATE_USER(state: State, user: User) {
    state.user = user
  }
}
