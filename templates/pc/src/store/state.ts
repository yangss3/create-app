import { reactive } from 'vue'

export interface State {
  locale: string
}

export const initState = {
  locale: 'zh'
}

const state = reactive(initState)


export default state
