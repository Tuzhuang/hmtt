// 所有关于搜索的接口请求都写在这个js文件中

// 导入封装后的axios
import request from '@/utilis/request';


// 封装搜索词汇建议的接口
export function suggestion(params) {
    return request({
        method: 'get',
        url: '/suggestion',
        params: params
    })
}


// 封装获取搜索结果的接口
export function getSearch(params) {
    return request({
        method: 'get',
        url: '/search',
        params: params
    })
}