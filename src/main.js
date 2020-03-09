import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入vant UI库 和 css文件
import Vant from 'vant';
import 'vant/lib/index.css';
// 导入字体图标
import '@/style/iconfont.css';

// 注册使用
Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
