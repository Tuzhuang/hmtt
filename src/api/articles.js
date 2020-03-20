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


// 封装获取文章详情的接口
export function getArticlesInfo(params) {
    return request({
        method: 'get',
        url: `/articles/${params}`
    })
}


// 封装点赞文章的接口
export function artLikings(data) {
    return request({
        method: 'post',
        url: `/article/likings`,
        data: {
            target: data
        }
    })
}


// 封装取消对文章点赞的接口
export function artDislikes(data) {
    return request({
        method: 'delete',
        url: `/article/dislikes/${data}`
    })
}


// 封装对文章不喜欢的接口
export function articleDisLikes(data) {
    return request({
        method: 'post',
        url: '/article/dislikes',
        data: {
            target: data
        }
    })
}


// 封装对文章取消不喜欢的接口
export function articleLikes(data) {
    return request({
        method: 'delete',
        url: `/article/dislikes/${data}`
    })
}


// 封装收藏文章的接口
export function articleCollections(data) {
    return request({
        method: 'post',
        url: '/article/collections',
        data: {
            target:data
        }
    })
}


// 封装取消收藏文章的接口
export function articleDisCollections(data) {
    return request({
        method: 'delete',
        url: `/article/collections/${data}`
    })
}