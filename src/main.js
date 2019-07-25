import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import ElementUI from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // 全局样式

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon

import * as filters from './filters' // 公共 filters

Vue.config.productionTip = false

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// 注册公共filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
