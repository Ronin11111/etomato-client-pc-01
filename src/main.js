import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入全局插件，进行注册
import UI from '@/components/library/main.js'

// 引入公共样式和重置样式
import 'normalize.css'
import '@/assets/style/common.less'

createApp(App).use(store).use(router).use(UI).mount('#app')
