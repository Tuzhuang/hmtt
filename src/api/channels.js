// 把获取用户频道列表的接口请求都封装到这个js文件里面

// 先导入封装后的axios
import request from '@/utilis/request';


// 获取用户频道列表的接口
export function getChanList() {
    return request({
        method: 'get',
        url: '/user/channels'
    })
}


// 获取全部频道的接口
export function getChanListAll() {
    return request({
        method: 'get',
        url: '/channels'
    })
}


// 封装批量修改用户频道数据列表的接口
export function editUserChannels(data) {
    return request({
        method: 'put',
        url: '/user/channels',
        data: data
    })
}


// 封装指定删除用户频道数据列表的接口
export function delUserChannels(data) {
    return request({
        method: 'delete',
        // url: `/user/channels/${data}`
        url: `/user/channels`,
        data:data
    })
}
