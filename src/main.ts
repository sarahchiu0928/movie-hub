import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import router from './router'
import './style.css'
import App from './App.vue'
// 入口點
createApp(App).use(VueQueryPlugin).use(router).mount('#app')
