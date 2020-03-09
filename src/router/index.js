import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入子组件
import login from '@/views/login/'  // 后面加一个 / 代表找到login页面下的index.js 或者 index.vue

Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    component:login
  }
]

const router = new VueRouter({
  routes
})

export default router
