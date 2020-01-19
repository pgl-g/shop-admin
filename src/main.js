import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 可下拉表格展示子项
import TreeTable from 'vue-table-with-tree-grid'

// element ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 全局引入富文本编译器
import VueQuillEditor from 'vue-quill-editor'
// require styles 富文本编译器的样式的引入
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 使用可下拉表格展示子项
Vue.component('tree-table', TreeTable)

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
// 时间过滤器
Vue.filter('deteFormat',function(originVal){
  const dt = new Date(originVal)

  const y = dt.getFullYear()

  const m = (dt.getMonth() + 1 + '').padStart(2, '0')

  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')

  const mm = (dt.getMinutes() + '').padStart(2, '0')

  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.use(ElementUI)

// 全局安装富文本编译器
Vue.use(VueQuillEditor)
// 全局样式
import './assets/css/base.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
