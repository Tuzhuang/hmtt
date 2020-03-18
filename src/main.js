import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入vant UI库 和 css文件
import Vant from 'vant';
import 'vant/lib/index.css';
// 导入字体图标
import '@/style/iconfont.css';

// 导入 day.js
import dayjs from 'dayjs';
// 导入相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime';
// 使用插件
dayjs.extend(relativeTime)
// 导入语言配置
import 'dayjs/locale/zh-cn'
// 更改语言配置信息  全局使用中文时间
dayjs.locale('zh-cn') // 全局使用简体中文

// let res = dayjs().from(dayjs('2020-3-14 10:07')) // 2 年以前

// // let res = dayjs().format('YYYY-MM-DD HH:mm:ss');
// console.log(res);

// 定义全局过滤器
Vue.filter('filterTime', function (val) {
  return dayjs().from(dayjs(val))
})

// 注册使用
Vue.use(Vant);

// 导入判断用户是否登录的插件
import myPlugin from '@/utilis/myPlugin';

// 注册使用
Vue.use(myPlugin)

Vue.config.productionTip = false




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
