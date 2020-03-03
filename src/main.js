import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/css/global.css'
// 导入element模块
// import ElementUI from 'element-ui'
// 引入axios相关
import '@/utils/ax.js'
// 注册使用element 组件
// Vue.use(ElementUI)
// 引入element.js
import '@/utils/element.js'

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
