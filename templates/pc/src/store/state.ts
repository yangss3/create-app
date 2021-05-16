import { Locale, Menus, User } from '@/utils/types'

export interface State {
  token: string
  username: string
  locale: Locale
  user: User
  menus: Menus
}

const state: State = {
  token: '',
  username: '',
  locale: (localStorage.getItem('APP_LOCALE') as Locale) || 'zh',
  user: {} as User,
  menus: []
}

export default state
