/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-07 15:47:18
 * @LastEditors  : lxw
 * @LastEditTime : 2019-12-25 14:19:57
 */
// 用户管理--更新用户接口
import request from '@/plugin/axios'

function updateUser (data) {
  return request({
    url: `man/updateByPrimaryKey`,
    method: 'post',
    data
  })
}

function updateTeacher (data) {
  return request({
    url: `teacher/updateByPrimaryKey`,
    method: 'post',
    data
  })
}

function updateStudent (data) {
  return request({
    url: `student/updateByPrimaryKey`,
    method: 'post',
    data
  })
}

export { updateUser, updateTeacher, updateStudent }
