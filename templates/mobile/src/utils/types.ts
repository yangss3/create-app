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
export interface User {
  id: string
  username: string
  role: Role
  createdDate: string
  status: boolean
  email?: string
  photo?: string
}
