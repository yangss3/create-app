import 'virtual:windi.css'
import 'virtual:windi-devtools'
import './assets/styles/base.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from './plugins'

const app = createApp(App)

app.use(router).use(store).use(plugins)

router.isReady().then(() => app.mount('#app'))
