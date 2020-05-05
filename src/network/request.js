import axios from 'axios'

// 进度条插件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function request (config) {

  // 创建axios实例
  const instance = axios.create({
    baseURL: 'http://47.115.124.102:8888/api/private/v1/',
    timeout: 5000
  })

  // 请求拦截 展示进度条 NProgress.start()
  instance.interceptors.request.use(res => {
    NProgress.start()
    // 为请求头对象添加 Token验证的 Authorization字段
    res.headers.Authorization = window.sessionStorage.getItem('token')
    return res
  }, err => {
    console.log(err)
  })

  // 响应拦截 隐藏进度条 NProgress.done()
  instance.interceptors.response.use(res => {
    NProgress.done()
    return res.data
  }, err => {
    console.log(err)
  })

  // 返回发送网络请求
  return instance(config)
}
