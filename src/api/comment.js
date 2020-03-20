// 所有关于评论的接口都写在这里

// 导入封装后的axios请求
import request from '@/utilis/request.js'


// 封装获取用户评论或者回复评论的接口
export function getComments(params) {
    return request({
        method: 'get',
        url: '/comments',
        params: params
    })
}


// 封装评论文章的接口
export function addComments(data) {
    return request({
        method: 'post',
        url: '/comments',
        data: data
    })
}


// 封装对评论点赞的接口
export function commentLikings(data) {
    return request({
        method: 'post',
        url: '/comment/likings',
        data: {
            target: data
        }
    })
}


// 封装取消评论点赞的接口
export function commentDisLikings(data){
    return request({
        method:'delete',
        url:`/comment/likings/${data}`
    })
}