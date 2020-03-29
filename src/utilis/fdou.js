// js防抖函数的封装

export function fangdou(callback, time) {
    // 先定义一个计时器id
    let timerID = null;
    // 使用闭包返回函数
    return function () {
        // 先清除上一次的计时器
        clearTimeout(timerID)
        timerID = setTimeout(callback, time)
    }
}


// 封装后的防抖会特别的麻烦，所以不建议封装
// 封装的步骤
// 首先先把this的指向赋值给window.that
// 然后再把防抖的方法写在自定义myFd的方法里
// 记得改变this指向
// 然后再@input事件里调用myFd方法就可以了