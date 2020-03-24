/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-05 16:02:09
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-25 14:17:36
 */
// 权限管理--编辑权限接口
import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function updatePermision (data) {
  return request({
    url: `perm/updateByPrimaryKey`,
    method: 'post',
    data
  })
}

export { updatePermision }
