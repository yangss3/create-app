// @ts-check

/**
 * @type {import('vitepress').DefaultTheme.Config['nav']}
 */
const nav = [
  { text: 'Foo', link: '/foo/', activeMatch: '^/foo/' },
  { text: 'Bar', link: '/bar/getting-started', activeMatch: '^/bar/' },
  {
    text: 'Baz',
    items: [
      { text: 'Vue', link: 'https://v3.vuejs.org/' },
      { text: 'Vite', link: 'https://vitejs.dev/' },
      { text: 'Node', link: 'https://nodejs.org/en/' }
    ]
  }
]

/**
 * @type {import('vitepress').DefaultTheme.Config['sidebar']}
 */
const sidebar = {
  '/foo/': [
    { text: 'Foo', link: '/foo/' }
  ],
  '/bar': [
    { text: 'Getting Started', link: '/bar/getting-started' },
    { text: 'Configuration', link: '/bar/configuration' }
  ]
}

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: 'Docs Template',
  /**
   * @type {import('vitepress').DefaultTheme.Config}
   */
  themeConfig: {
    repo: 'yangss3/create-app',
    nav,
    sidebar
  }
}
