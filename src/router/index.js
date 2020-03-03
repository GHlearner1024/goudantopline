import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home'
// 引入nprogress相关的js和css文件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [
      // 欢迎页面子路由配置
      { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
      { path: '/article', name: 'article', component: () => import('@/views/article') },
      { path: '/articleadd', name: 'articleadd', component: () => import('@/views/articleadd') },
      // 修改文章，路由地址要传递参数，体现出被修改文章id，名称为aid
      { path: '/articleedit/:aid', name: 'articleedit', component: () => import('@/views/articleedit') },
      { path: '/account', name: 'account', component: () => import('@/views/account') },
      { path: '/material', name: 'material', component: () => import('@/views/material') },
      { path: '/fans', name: 'fans', component: () => import('@/views/fans') },
      { path: '/comment', name: 'comment', component: () => import('@/views/comment') }
    ]
  }

]

const router = new VueRouter({
  routes
})
// 配置全局前置路由守卫
router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.inc()
  // 获得用户登录状态信息
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 登录状态 : userinfo是大字符串,非登录状态,userinfo是null
  if (!userinfo && to.path !== '/login') {
    // 强制登录
    return next('/login')
  }
  // 放行
  next()
})
// 全局后置路由守卫
router.afterEach((from, next) => {
  // 完成进度条显示了
  NProgress.done()
})
export default router
