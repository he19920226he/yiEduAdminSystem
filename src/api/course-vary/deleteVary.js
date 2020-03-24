/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-07 20:23:36
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-24 23:23:39
 */
// 课程分类管理--删除课程类别
import request from '@/plugin/axios'

function deleteVary (data) {
  return request({
    url: `kindInfo/deleteByPrimaryKey?id=${data.id}`,
    method: 'get'
  })
}

export { deleteVary }
