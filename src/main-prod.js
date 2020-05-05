import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入element Ui
import Element from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'
import TreeTable from 'vue-table-with-tree-grid'

import 'element-ui/lib/theme-chalk/index.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false

// 定义全局事件总线
Vue.prototype.$bus = new Vue()

Vue.use(Element)
Vue.use(VueQuillEditor)
Vue.component('te-table', TreeTable)

// 定义全局过滤器
Vue.filter('fullFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
