/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-10 08:21:59
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-25 14:15:59
 */

import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function courseSelect (data) {
  // 此时的data里面只包含有数据的查询状态 pageNum=1&pageSize=10&phone=1&state=1&beforeDate=1&afterDate=1
  let query = ''
  for (let key in data) {
    query += `${key}=${data[key]}&`
  }
  query = query.slice(0, query.length - 1)
  console.log(query)
  return request({
    url: `crouseInfo/multiCriteriaQuery?${query}`,
    method: 'get'
  })
}

export { courseSelect }
