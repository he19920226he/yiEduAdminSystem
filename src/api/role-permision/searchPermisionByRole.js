/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-10 02:43:55
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-25 14:18:35
 */
// // 角色-权限--根据角色id查询角色接口
import request from '@/plugin/axios'

function searchPermisionByRole (data) {
  return request({
    url: `roleAndPer/selectByRoleId?pageNum=${data.pageNum}&pageSize=${data.pageSize}0&roleId=${data.roleId}`,
    method: 'get'
  })
}

export { searchPermisionByRole }
