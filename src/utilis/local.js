// 封装将数据保存到本地的方法


// 封装保存数据到本地的方法
export function setLocal(key, val) {
    window.localStorage.setItem(key, val);
}


// 封装取出本地数据的方法
export function getLocal(key) {
    return JSON.parse(window.localStorage.getItem(key));
}


// 封装删除本地数据的方法
export function removeLocal(key) {
    window.localStorage.removeItem(key);
}