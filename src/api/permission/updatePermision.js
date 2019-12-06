// 权限管理--编辑权限接口
import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function updatePermision (data) {
  return request({
    url: `/perm/updateByPrimaryKey`,
    method: 'post',
    data
  })
}

export { updatePermision }
