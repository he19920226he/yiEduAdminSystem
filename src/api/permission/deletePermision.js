// 权限管理--删除权限接口
import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function deletePermision (data) {
  return request({
    url: `/perm/deleteByPrimaryKey?id=${data.id}`,
    method: 'get'
  })
}

export { deletePermision }
