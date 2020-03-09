// 把关于token的方法抽取到这个js文件里面

// 声明一个token常量
let TOKENKEY = "tokenInfo";


// 获取token
export function getToken() {
    return JSON.parse(window.localStorage.getItem(TOKENKEY))
}


// 设置token
export function setToken(value) {
    window.localStorage.setItem(TOKENKEY, JSON.stringify(value));
}


// 删除token
export function removeToken() {
    window.localStorage.removeItem(TOKENKEY);
}