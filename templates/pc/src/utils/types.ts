import { ColumnProps } from 'ant-design-vue/lib/table/interface'
import { locales } from './meta'

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
export function isSubMenu(menu: MenuItem | SubMenu): menu is SubMenu {
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

export type TableColumns<T> = ({
  key?: keyof T | 'operation'
  dataIndex: keyof T | 'operation'
  slots?: { customRender: keyof T | 'operation'; [key: string]: any }
} & ColumnProps)[]

export type RequiredPick<T extends object, K extends keyof T> = Required<
  Pick<T, K>
>
