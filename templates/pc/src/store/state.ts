import { reactive } from 'vue'

export interface State {
  locale: string
}

export const initState: State = {
  locale: 'zh'
}

export default reactive(initState)
