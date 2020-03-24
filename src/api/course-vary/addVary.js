/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-10 21:53:38
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-25 14:15:25
 */
// 课程管理--添加课程类别
import request from '@/plugin/axios'

function addKind (data) {
  return request({
    url: `kindInfo/insertSelective`,
    method: 'post',
    data
  })
}

export { addKind }
