import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'

// element ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$http = axios
// 配置请求的跟路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 配置axios拦截器
axios.interceptors.request.use( config => {
 /*  console.log(config) */
 /* 为请求头对象，添加Token 验证的Authorization字段 */
  config.headers.Authorization = window.sessionStorage.getItem('token')
 return config
})

Vue.use(ElementUI)
// 全局样式
import './assets/css/base.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
