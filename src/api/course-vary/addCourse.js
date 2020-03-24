/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-10 10:50:42
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-25 14:15:17
 */

import request from '@/plugin/axios'

function addCourseBase (data) {
  return request({
    url: `crouseInfo/insertSelective`,
    method: 'post',
    data
  })
}

export { addCourseBase }
