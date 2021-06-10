import { createI18n } from '@yangss/vue3-i18n'

const locales = import.meta.globEager('./locales/*.json')

const messages = Object.fromEntries(
  Object.entries(locales).map(([key, value]) => {
    return [key.split('/').pop()!.split('.').shift(), value.default]
  })
)

const { install, i18n } = createI18n({
  locale: 'zh',
  messages
})

export const t = i18n.t
export default install
