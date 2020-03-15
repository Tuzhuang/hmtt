// 把axios的封装单独抽取成一个文件

// 先导入axios
import axios from 'axios';
// 导入vuex
import store from '@/store/'
// 导入json-Bigint  截取长数据
import jsonBig from 'json-bigint';

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
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

// 把request暴露出去
export default request;