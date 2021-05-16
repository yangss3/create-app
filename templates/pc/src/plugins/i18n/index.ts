import { createI18n } from '@yangss/vue3-i18n'

const locales = import.meta.globEager('./locales/*.json')

const messages = Object.fromEntries(
  Object.entries(locales).map(([key, value]) => {
    return [key.split('/').pop()!.split('.').shift(), value.default]
  })
)

const { i18n, t } = createI18n({
  locale: 'zh',
  fallbackLocale: 'zh',
  messages
})

export { t }
export default i18n