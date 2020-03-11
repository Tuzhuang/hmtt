import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入子组件
import login from '@/views/login/'  // 后面加一个 / 代表找到login页面下的index.js 或者 index.vue
import layout from '@/views/layout/'
import home from '@/views/home/'
import faqs from '@/views/faqs/'
import video from '@/views/video/'
import mine from '@/views/mine/'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
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
  }

]

const router = new VueRouter({
  routes
})

export default router
