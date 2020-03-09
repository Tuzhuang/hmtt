import Vue from 'vue'
import Vuex from 'vuex'
// 导入取出token的方法
import { getToken } from '@/utilis/token.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 普通token
    token: getToken().token,
    // token: '',
    // 长久token
    refresh_token: getToken().refresh_token,
    // refresh_token: ''
  },
  mutations: {
    // 给普通token赋值的方法
    changeToken(state, token) {
      state.token = token;
    },
    // 给长久token赋值的方法
    changeRefToken(state, token) {
      state.refresh_token = token;
    }
  },
  actions: {
  },
  modules: {
  }
})
