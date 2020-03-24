/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-05 17:28:42
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-25 14:16:44
 */
// 权限管理--添加权限接口
import request from '@/plugin/axios'

function addPermision (data) {
  return request({
    url: `perm/insert`,
    method: 'post',
    data
  })
}

export { addPermision }
