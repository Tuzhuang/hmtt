import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入子组件
import login from '@/views/login/'  // 后面加一个 / 代表找到login页面下的index.js 或者 index.vue
import layout from '@/views/layout/'
import home from '@/views/home/'
import faqs from '@/views/faqs/'
import video from '@/views/video/'
import mine from '@/views/mine/'
import search from '@/views/search/'
import searchResult from '@/views/searchResult/'
import detail from '@/views/detail/'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: login
  },
  {
    // 给login组件再加一个跳转的路由，但是进入的组件还是login
    path: '/checklogin',
    component: login
  },
  {
    path: '/layout',
    component: layout,
    children: [
      {
        path: '/home',   // 主页面
        component: home
      },
      {
        path: '/faqs',   // 问答页面
        component: faqs
      },
      {
        path: '/video',   // 视频页面
        component: video
      },
      {
        path: '/mine',   // 我的页面
        component: mine
      }
    ]
  },
  {
    path: '/search',  // 搜索页面
    component: search
  },
  {
    // 动态路由匹配
    path: '/searchResult/:key',  // 搜索结果页面
    component: searchResult
  },
  {
    // 动态路由匹配
    path: '/detail/:key',  // 文章详情页面
    component: detail
  },
  {
    // 路由重定向
    path: '*',  // 
    redirect: '/login'
  }

]

const router = new VueRouter({
  routes
})

export default router
