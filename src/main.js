import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import SkuForm from './components/index'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(SkuForm)

app.mount('#app')
