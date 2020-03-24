/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-10 13:17:32
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-25 14:15:52
 */

import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function deleteCourse (data) {
  return request({
    url: `crouseInfo/deleteByPrimaryKey?cid=${data.cid}`,
    method: 'get'
  })
}

export { deleteCourse }
