import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import util from '@/libs/util'

// 创建一个错误
// function errorCreate (msg) {
//   const error = new Error(msg)
//   errorLog(error)
//   throw error
// }

// 记录和显示错误
function errorLog (error) {
  // 添加到日志
  store.dispatch('d2admin/log/push', {
    message: '数据请求异常',
    type: 'danger',
    meta: {
      error
    }
  })
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(error)
  }
  // 显示提示
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
}

// 创建一个 axios 实例
// 在这里简单通过process.env.NODE_ENV环境变量判断当前是开发环境还是生产环境：动态修改接口地址
// 部署后vue-cli3的跨域配置失效，此时我本地通过ngnix配置代理跨域：代理服务器地址是local:8888，映射真实接口地址。所以build后的地址改为http://localhost:8888/YIedu/
// 现在更新部署上线后的接口地址baseurl为http://106.15.250.119:8090/YIedu/,是因为现在项目是部署到了后台服务器上的nginx静态资源服器里面了，也就是服务器linxu里面安装了nginx，同你本地安装启动配置代理跨域类似
// 服务器的nginx启动是服务器ip + 端口号8090 ，所以我接口也是
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_API : 'http://47.103.223.248:8095/YIedu/', // 部署仍然不是那種部署到服務器後臺項目目錄，也就是部署到服務器，
  withCredentials: true, // 但是不是後臺工程目錄的webapp目錄，仍然存在跨域問題，
  // 怎麽說呢，就是這是完全的前後端分類了，可能後臺需要一個靜態資源服務器托管前端項目，所以仍然需要解決跨域問題。
  timeout: 5000 // 请求超时时间
})
console.log('目前请求接口前缀', process.env.VUE_APP_API)

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    const token = util.cookies.get('token')
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['X-Token'] = token
    return config
  },
  error => {
    // 发送失败
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    console.log(dataAxios)
    // 这个状态码是和后端约定的
    const { code } = dataAxios
    // 根据 code 进行判断
    if (code === undefined) {
      return dataAxios
    } else {
      switch (code) {
        case 1028:
          // code === 1028 代表没有错误
          if (dataAxios.message !== '登录成功') {
            Message({
              message: dataAxios.message,
              type: 'success'
            })
          }

          return dataAxios
        case 1224:
          // code === 1224 代表没有错误
          return dataAxios
        default:
          // 拦截状态码不是上面的情况的错误信息
          errorLog({ message: dataAxios.message })
          return Promise.reject(dataAxios)
      }
    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400: error.message = '请求错误'; break
        case 401: error.message = '未授权，请登录'; break
        case 403: error.message = '拒绝访问'; break
        case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
        case 408: error.message = '请求超时'; break
        case 500: error.message = '服务器内部错误'; break
        case 501: error.message = '服务未实现'; break
        case 502: error.message = '网关错误'; break
        case 503: error.message = '服务不可用'; break
        case 504: error.message = '网关超时'; break
        case 505: error.message = 'HTTP版本不受支持'; break
        default: break
      }
      error.message = '网络连接错误或服务器内部错误，请检查网络重新试试或联系1143167344@qq.com'
    }
    error.message = '网络连接错误或服务器内部错误，请检查网络重新试试或联系1143167344@qq.com'
    errorLog(error)
    return Promise.reject(error)
  }
)

export default service
