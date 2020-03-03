// 独立文件，用于存储axios相关代码
// 引入路由
import router from '@/router'
// 导入Vue模块
import Vue from 'vue'

// 导入axios模块
import axios from 'axios'
import JSONBig from 'json-bigint'
// 配置公共跟地址(线上地址)
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'
// 配置为Vue的原型继承成员
Vue.prototype.$http = axios
// 配置请求拦截器
axios.interceptors.request.use(function (config) {
  // 发送请求的相关逻辑
  // config:对象  与axios.defaults相当 借助config配置token
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 判断token存在做配置
  if (userinfo) {
    let token = JSON.parse(userinfo).token
    // 注意:token前边有'Bearer' 的信息前缀
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (error) {
  // Do something width request eror
  return Promise.reject(error)
})
// 配置响应拦截器
axios.interceptors.response.use(function (response) {
  // 正常响应处理
  return response
}, function (error) {
  // 非正常响应处理(包括401)
  if (error.response.status === 401) {
    // token失效 ,2小时失效  强制用户重新登录系统
    router.push('/login')
    // 不要给做错误提示了
    return new PromiseRejectionEvent(function () {})
  }
  return Promise.reject(error)
})
// 服务器端返回，数据转换器，应用
axios.defaults.transformResponse = [function (data) {
  // data的返回形式有两种
  // 1. 实体字符串
  // 2. 空字符串(不能转的)
  // JSONbig.parse针对大整型进行处理，其他信息不给处理
  if (data) {
    return JSONBig.parse(data)
  }
  return data
}]
