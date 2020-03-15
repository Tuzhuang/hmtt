// 把关于新闻列表的接口封装到这个js文件里面


// 导入封装后的axios
import request from '@/utilis/request.js';


// 封装获取新闻推荐列表的接口
export function getArtiList(params) {
    return request({
        method: 'get',
        url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
        params: params
    })
}


// 封装不感兴趣的请求
export function dislikes(data) {
    return request({
        method: 'post',
        url: '/article/dislikes',
        data: {
            target: data.toString()
        }
    })
}


// 封装举报文章的接口请求
export function reports(data) {
    return request({
        method: 'post',
        url: '/article/reports',
        data: data
    })
}


// 封装拉黑用户的接口请求
export function blacklists(data) {
    return request({
        method: 'post',
        url: '/user/blacklists',
        data: {
            target: data
        }
    })
}