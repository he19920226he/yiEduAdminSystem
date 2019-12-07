// 用户管理--删除用户接口
import request from '@/plugin/axios'

// 删除管理员
function deleteManager (data) {
  return request({
    url: `/man/deleteByPrimaryKey?id=${data.id}`,
    method: 'get'
  })
}

// 删除教师
function deleteTeacher (data) {
  return request({
    url: `/teacher/deleteByPrimaryKey?id=${data.id}`,
    method: 'get'
  })
}

// 删除学生
function deleteUser (data) {
  return request({
    url: `/student/deleteByPrimaryKey?id=${data.id}`,
    method: 'get'
  })
}

export { deleteManager, deleteTeacher, deleteUser }
