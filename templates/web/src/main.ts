import 'virtual:windi.css'
import './assets/styles/base.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import plugins from './plugins'

const app = createApp(App)

app.use(router).use(plugins)

router.isReady().then(() => app.mount('#app'))
