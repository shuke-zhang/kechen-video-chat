import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import { vTrunc } from './directive'
import router from './router'
import { formatDefaultDate, formatterTableEmpty, getSelectData, selectDictLabels } from './utils'
import './styles/tailwindcss.css'
import '@/components/icon-font/iconfont'

const app = createApp(App)
// 注册全局方法
app.config.globalProperties.$formatterTableEmpty = formatterTableEmpty
app.config.globalProperties.$formatDefaultDate = formatDefaultDate
app.config.globalProperties.$selectDictLabels = selectDictLabels
app.config.globalProperties.$getSelectData = getSelectData
app.directive('trunc', vTrunc)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

app.mount('#app')
