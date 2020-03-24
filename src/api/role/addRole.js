/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-05 21:42:13
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-25 14:17:47
 */
// 角色管理--添加角色接口
import request from '@/plugin/axios'

function addRole (data) {
  return request({
    url: `roles/insert`,
    method: 'post',
    data
  })
}

export { addRole }
