// 把axios的封装单独抽取成一个文件

// 先导入axios
import axios from 'axios';
// 导入vuex
import store from '@/store/'
// 导入json-Bigint  截取长数据
import jsonBig from 'json-bigint';
// 再导入保存token的方法
import { setToken } from './token'

// 再生成创建一个axios对象
let request = axios.create({
    // 接口请求基地址
    baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/',
    // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
    transformResponse: [function (data) {
        // 对 data 进行任意转换处理
        // 对数据进行截取
        return jsonBig.parse(data);
    }],

})

// 再生成一个新的axios对象，因为如果要重新刷新token的话就不能用之前错误的token
let tempRequest = axios.create({
    // 接口的请求基地址
    baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/',
})


// axios的请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 先判断当前如果没有登录的话就不要加Authorization
    if (store.state.token) {
        // 添加请求头Authorization
        config.headers.Authorization = 'Bearer ' + store.state.token;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // 直接返回res里面的data对象
    return response.data;
}, async function (error) {
    // 打印出来报错的对象 使用dir
    console.dir(error)
    // 判断当前响应出错的时候报错的状态码，如果是token失效的话就重新刷新token，请求新的接口
    if (error.response.status === 401) {
        // 用新创建的axios对象重新请求刷新token,因为之前的request里面保存了一些错误的配置信息
        let res = await tempRequest({
            method: 'put',
            url: '/authorizations',
            headers: {
                // 需要传入 refresh_token
                Authorization: `Bearer ${store.state.refresh_token}`
            }
        })
        // 打印刷新token后的结果
        // console.log(res)
        // 将刷新后的新的token保存到vuex和本地里面
        store.commit('changeToken', res.data.data.token);
        // 把token和refresh_token 保存到一个对象里面
        let tokenInfo = {
            token: res.data.data.token,
            refresh_token: store.state.refresh_token
        }
        // 调用方法将token保存到本地 ，因为在方法文件内做了转换，所以这里可以直接传对象
        setToken(tokenInfo);
        // 得到新的token之后呢，就要重新请求拦截之前报错的请求，所以重新发送一次请求
        let oldRes = await request(error.config);
        // 得到之前报错请求的新数据后再返回给请求的地方，因为我们加了请求拦截，所以此时的token已经是更新后的token了，不会报错
        // console.log(oldRes)
        return oldRes;
    } else {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
});

// 把request暴露出去
export default request;