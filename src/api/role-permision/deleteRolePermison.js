// 角色管理--取消权限
import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function deleteRolePermison (data) {
  return request({
    url: `roleAndPer/deleteByPrimaryKey?id=${data.id}`,
    method: 'get'
  })
}

export { deleteRolePermison }
