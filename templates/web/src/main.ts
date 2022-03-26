import 'uno.css'
import '@unocss/reset/tailwind.css'
import './assets/styles/base.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

router.isReady().then(() => app.mount('#app'))
