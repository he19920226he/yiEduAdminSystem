// 角色管理--更新角色接口
import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function updateRole (data) {
  return request({
    url: `roles/updateByPrimaryKey`,
    method: 'post',
    data
  })
}

export { updateRole }
