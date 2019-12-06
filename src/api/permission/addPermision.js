// 权限管理--添加权限接口
import request from '@/plugin/axios'

function addPermision (data) {
  return request({
    url: `/perm/insert`,
    method: 'post',
    data
  })
}

export { addPermision }
