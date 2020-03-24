/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-10 02:46:18
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-25 14:18:25
 */
// 角色分配权限管理--分配权限接口
import request from '@/plugin/axios'

function addPermisionRole (data) {
  return request({
    url: `roleAndPer/insert`,
    method: 'post',
    data
  })
}

export { addPermisionRole }
