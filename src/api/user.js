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
export function userFolloFalse(data) {
    return request({
        method: 'delete',
        url: `/user/followings/${data}`
    })
}


// 封装获取用户自己的信息
export function getUserInfo() {
    return request({
        method: 'get',
        url: '/user'
    })
}


// 封装获取用户个人资料的接口  返回用户名 头像 生日
export function getUserProfile() {
    return request({
        method: 'get',
        url: '/user/profile'
    })
}


// 封装编辑用户头像的接口
export function userPhoto(data) {
    // axios就是对原生的ajax的一个封装
    // axios只是一个库（插件的意思），发ajax的库
    // 跟jquery一样，也封装了一个发ajax的库
    // 为什么不用jquery？因为jquery太大，除了封装了ajax，还封装了一些别的操作dom的方法
    // 所以我们还是用ajax，因为他比较单纯，只是封装了发请求的一些方法，所以就显得比较轻量
    // axios的本质还是发的ajax的请求（ajax：异步请求，异步刷新，就是我们不用刷新页面就发一个请求）
    // 再细节一点，不管是jquery发的请求还是axios发的ajax请求
    // 他们的本质内部都是用XMLHttpRequest对象发的请求
    // ajax如果想传文件，那么直接传是没用的
    // 要通过formData对象来传递文件
    let fm = new FormData();
    // key叫photo，值就是我们刚才传递过来的photo
    fm.append('photo', data.photo)

    return request({
        method: 'patch',
        url: '/user/photo',
        data: fm
    })
}


// 封装编辑用户个人信息的接口
export function editUserProfile(data) {
    return request({
        method: 'patch',
        url: '/user/profile',
        data: data
    })
}