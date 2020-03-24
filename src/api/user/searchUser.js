/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-07 15:17:08
 * @LastEditors  : lxw
 * @LastEditTime : 2019-12-25 16:28:02
 */
// 用户管理--查询用户接口
// 三类用户的相关查询接口都在这里了
// 管理员、教师、学生（移动端用户查询）

import request from '@/plugin/axios'

// 查询所有管理员
function managerSelectAll (data) {
  return request({
    url: `man/selectAll?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'get'
  })
}

// 根据手机号查询管理员
function managerSelectByPhone (data) {
  return request({
    url: `man/selectByPhone?phone=${data.phone}`,
    method: 'get'
  })
}

// 跟不同的条件查询教师，如果字段为空不要传
function teacherSelect (data) {
  // 此时的data里面只包含有数据的查询状态 pageNum=1&pageSize=10&phone=1&state=1&beforeDate=1&afterDate=1
  let query = ''
  for (let key in data) {
    query += `${key}=${data[key]}&`
  }
  query = query.slice(0, query.length - 1)
  console.log(query)
  return request({
    url: `teacher/selects?${query}`,
    method: 'get'
  })
}

// 分頁查詢所有老師
function selectAllTeachers () {
  return request({
    url: `teacher/selects?pageNum=1&pageSize=1000`,
    method: 'get'
  })
}

// 跟不同的条件查询学生，如果字段为空不要传
function studentSelect (data) {
  // 此时的data里面只包含有数据的查询状态 pageNum=1&pageSize=10&phone=1&state=1&beforeDate=1&afterDate=1
  let query = ''
  for (let key in data) {
    query += `${key}=${data[key]}&`
  }
  query = query.slice(0, query.length - 1)
  console.log(query)
  return request({
    url: `student/selects?${query}`,
    method: 'get'
  })
}

// 根據學生id查詢學生喜喜
function selectStudentById (data) {
  return request({
    url: `student/selectByPrimaryKey?id=${data.id}`,
    method: 'get'
  })
}

export { managerSelectAll, managerSelectByPhone, teacherSelect, selectAllTeachers, studentSelect, selectStudentById }
