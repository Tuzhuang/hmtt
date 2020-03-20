// 所有关于用户的接口都封装到这个js文件里面

// 导入抽取后的axios
import request from '@/utilis/request';


// 封装关注作者的接口
export function userFolloTrue(data) {
    return request({
        method: 'post',
        url: '/user/followings',
        data: {
            target: data
        }
    })
}


// 封装取消关注用户的接口
export function userFolloFalse(data){
    return request({
        method:'delete',
        url:`/user/followings/${data}`
    })
}