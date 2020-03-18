// 用于判断用户是否登录是否存在token的一个插件

// 因为要用到vuex，所以导入store
import store from '@/store/'
// 按需导入轻提示
import { Toast } from 'vant';
// 导入路由组件
import router from '@/router/'


// 先准备一个对象，里面有判断用户是否登录的方法
let myPlugin = {
    // 用于判断用户是否登录的函数，函数要返回一个布尔值
    // 为true就代表有token，代表登录了
    // 为false代表用户没有登录，那么久要跳转到登录页
    checkLogin() {
        if (store.state.token) {
            // 说明有token，返回true
            return true;
        } else {
            // 说明没有token，弹出提示，并返回登录页
            Toast.fail('请先登录');
            // 跳回登录页  如果是从组件里面的按钮进入的登录页就跳转到checklogin路径
            router.push('/checklogin');
            // 并返回false
            return false
        }
    },
    // 因为是定义成插件，所以对象要提供一个install方法
    install(Vue) {
        // 把判断用户是否登录的方法给Vue的原型
        Vue.prototype.checkLogin = myPlugin.checkLogin;
    }
}


// 把插件暴露出去
export default myPlugin;