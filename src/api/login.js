// 所有关于登录页面的请求都写在这里

// 导入抽取后的axios对象
import request from '@/utilis/request.js';

// 登录的接口
export function login(data){
    return request({
        method:'post',
        url:'/authorizations',
        data:data
    })
}