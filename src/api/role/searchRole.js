/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-05 18:00:09
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-25 14:18:04
 */
// 角色管理--查询角色接口
import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function selectAllRole (data) {
  return request({
    url: `roles/selectAll?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'get'
  })
}

//
function selectRoleByName (data) {
  return request({
    url: `roles/selectByName?name=${data.keyword}`,
    method: 'get'
  })
}

export { selectAllRole, selectRoleByName }
