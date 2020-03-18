// js防抖函数的封装

export function fangdou(callback, time) {
    // 先定义一个计时器id
    let timerID = null;
    // 使用闭包返回函数
    return function () {
        // 先清除上一次的计时器
        timerID = setTimeout(callback, time)
    }
}