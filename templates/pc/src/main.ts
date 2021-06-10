import 'virtual:windi.css'
import 'virtual:windi-devtools'
import './assets/styles/base.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store, { storeKey } from './store'
import http from './service'
import plugins from './plugins'

// Mock the backend api
import '@/service/mock'

const app = createApp(App)

app.use(store, storeKey).use(router).use(http).use(plugins)

router.isReady().then(() => app.mount('#app'))
