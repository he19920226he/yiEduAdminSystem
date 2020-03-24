/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-10 04:09:22
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-23 23:27:37
 */

import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function getHigherLevel (level) {
  return request({
    url: `kindInfo/getHigherLevel?level=${level}&pageNum=1&pageSize=100`,
    method: 'get'
  })
}

export { getHigherLevel }
