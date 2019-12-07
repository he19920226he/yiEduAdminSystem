// 用户管理--更新用户接口
import request from '@/plugin/axios'

function updateUser (data) {
  return request({
    url: `/man/updateByPrimaryKey`,
    method: 'post',
    data
  })
}

function updateTeacher (data) {
  return request({
    url: `/teacher/updateByPrimaryKey`,
    method: 'post',
    data
  })
}

function updateStudent (data) {
  return request({
    url: `/student/updateByPrimaryKey`,
    method: 'post',
    data
  })
}

export { updateUser, updateTeacher, updateStudent }
