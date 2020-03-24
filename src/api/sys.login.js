/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-05 09:30:32
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-25 14:20:06
 */
import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function LoginAdmin (data) {
  return request({
    url: `login/manager/goLogin?name=${data.name}&password=${data.password}`,
    method: 'get'
  })
}

//
function LoginTeacher (data) {
  return request({
    url: `login/tec/goLogin?phone=${data.phone}&password=${data.password}`,
    method: 'get'
  })
}

export { LoginAdmin, LoginTeacher }
