// 角色管理--添加角色接口
import request from '@/plugin/axios'

function addRole (data) {
  return request({
    url: `/roles/insert`,
    method: 'post',
    data
  })
}

export { addRole }
