import { ComputedRef } from 'vue'
import { locales } from './constants'

export type Locale = keyof typeof locales

export enum Role {
  admin = 'ADMIN',
  user = 'USER'
}

export interface Auth {
  token: string
  username: string
}

export interface MenuItem {
  path: string
  name: string
  title: string
  icon?: string
  id: string
  parentId?: string
}
export interface SubMenu {
  name: string
  title: string
  children: (MenuItem | SubMenu)[]
  icon?: string
  path?: string
  id: string
  parentId?: string
}
export type Menus = (MenuItem | SubMenu)[]
export function isSubMenu (menu: MenuItem | SubMenu): menu is SubMenu {
  return (menu as SubMenu).children?.length > 0
}

export interface User {
  id: string
  username: string
  role: Role
  createdDate: string
  status: boolean
  email?: string
  photo?: string
}

type FItem = { text: string; value: string; children?: FItem[] }

export type TableColumns<T> = {
  dataIndex: keyof T | 'operation'
  title: string | ComputedRef<string>
  align?: 'center' | 'left' | 'right'
  key?: keyof T | 'operation'
  slots?: { customRender: keyof T | 'operation'; [key: string]: any }
  filters?: FItem[]
  ellipsis?: boolean
  width?: number
}[]

export type RequiredPick<T, K extends keyof T> = Required<Pick<T, K>>

export type RuleFunc = (form: any) => Record<string, any>[]
export type Rule = Record<string, any>[] | RuleFunc
