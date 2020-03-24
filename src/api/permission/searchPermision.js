/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-06 21:52:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-25 14:17:24
 */
// 权限管理--查询权限接口
import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function selectAll (data) {
  let url
  if (data.title === undefined || data.title.replace(/\s*/g, '') === '') {
    url = `perm/selects?pageNum=${data.pageNum}&pageSize=${data.pageSize}`
  } else {
    url = `perm/selects?pageNum=${data.pageNum}&pageSize=${data.pageSize}&title=${data.title}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

export { selectAll }
