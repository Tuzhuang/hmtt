// 把axios的封装单独抽取成一个文件

// 先导入axios
import axios from 'axios';

// 再生成创建一个axios对象
let request = axios.create({
    // 接口请求基地址
    baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/'
})


// axios的请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
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