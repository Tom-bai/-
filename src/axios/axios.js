import Vue from 'vue'
import axios from 'axios'
import url from './url'
import { Toast } from 'vant'
import router from '../router'
// import qs from 'qs'
Vue.use(Toast)
// 响应时间
axios.defaults.timeout = 30 * 1000
// 配置cookie
// axios.defaults.withCredentials = true
// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// 静态资源
Vue.prototype.$static = ''
// 配置接口地址 //192.168.10.191   // http://localhost:8083
axios.defaults.baseURL = url.urlblockY
// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use(
    config => {
        // if (config.method === 'post') {
        //     config.data = qs.stringify(config.data)
        // }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)
// 返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
    res => {
        return res
    },
    err => {
        var originalRequest = err.config
        if (err.code == 'ECONNABORTED' && err.message.indexOf('timeout')!=-1 && !originalRequest._retry) {
            originalRequest._retry = true
            toast('链接超时，请检查网络！')
            return Promise.reject(err)
        }
    }
)
// 发送请求
export function post(url, params, msg) {
    return new Promise((resolve, reject) => {
        let loading = Toast.loading({
            duration: 0,       // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: 'spinner',
            message: msg || '加载中...'
        });
        axios({
            method: 'post',
            url: url,
            params: {
                data: params
            }
        }).then(
            res => {
                loading.clear()
                if (res.data.code < 0) {
                    toast('登录已过期')
                    setTimeout(() => {
                        router.push({path: '/'})
                    }, 1000);
                } else if (res.data.code == 200) {
                    resolve(res.data)
                } else {
                    toast(res.data.message)
                }
        })
        .catch(
            err => {
                loading.clear()
                reject(err.data)
        })
    })
}
export function postTwo(url, params, msg) {
    return new Promise((resolve, reject) => {
        let loading = Toast.loading({
            duration: 0,       // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: 'spinner',
            message: msg || '加载中...'
        });
        axios({
            method: 'post',
            url: url,
            data: params
        }).then(
            res => {
                loading.clear()
                if (res.data.code < 0) {
                    toast('登录已过期')
                    setTimeout(() => {
                        router.push({path: '/'})
                    }, 1000);
                } else if (res.data.code == 200) {
                    resolve(res.data)
                } else {
                    toast(res.data.message)
                }
        })
        .catch(
            err => {
                loading.clear()
                reject(err.data)
        })
    })
}
export function get(url, params, msg) {
    return new Promise((resolve, reject) => {
        let loading = Toast.loading({
            duration: 0,       // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: 'spinner',
            message: msg || '加载中...'
        });
        axios({
            method: 'get',
            url: url,
            params: {
                data: params
            }
        }).then(
            res => {
                loading.clear()
                if (res.data.code < 0) {
                    toast('登录已过期')
                    setTimeout(() => {
                        router.push({path: '/'})
                    }, 1000);
                } else if (res.data.code == 200) {
                    resolve(res.data)
                } else {
                    toast(res.data.message)
                }
        })
        .catch(
            err => {
                loading.clear()
                reject(err)
        })
    })
}
export function formatTime(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substring(4 - RegExp.$1.length))
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
    }
    return fmt
}

export function remainingTime(date) {

    let getdata = new Date(date.replace(/-/g,'/'))
    let nowdate = new Date()
    let newdata = getdata.getTime() - nowdate.getTime()  // 时间差的毫秒数
    let days = Math.floor(newdata / (24*3600*1000)) // 相差天数
    var leave1 = newdata%(24*3600*1000)    // 计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600*1000)) // 相差天数
    var leave2 = leave1%(3600*1000)        // 计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60*1000)) // 计算相差分钟数
    var leave3 = leave2%(60*1000)      // 计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3/1000)     // 计算相差秒数
    let text = ''
    if (newdata <= 0) {
        text = 0 + "天 " + 0 + "小时 " + 0 + "分钟 " + 0 +"秒"
    } else {
        text = days + "天 " + hours + "小时 " + minutes + "分钟 " + seconds +"秒"
    } 
    return text
}

export function toast(message) {
    Toast({
        duration: 0,       // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: message
    });
    let second = 1
    const timer = setInterval(() => {
        second--
        if (!second) {
            clearInterval(timer)
            Toast.clear()
        }
    }, 1500);
}

function padLeftZero(str) {
    return ('00' + str).substring(str.length)
}
