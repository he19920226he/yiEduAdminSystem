/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-07 18:30:23
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-24 00:00:50
 */
// 评论管理--查询评论接口

import request from '@/plugin/axios'

// 根据不同的条件查询教师，如果字段为空不要传
function commentSelect (data) {
  // 此时的data里面只包含有数据的查询状态 pageNum=1&pageSize=10&phone=1&state=1&beforeDate=1&afterDate=1
  let query = ''
  for (let key in data) {
    query += `${key}=${data[key]}&`
  }
  query = query.slice(0, query.length - 1)
  console.log(query)
  return request({
    url: `comment/selectByMultiple?${query}`,
    method: 'get'
  })
}

export { commentSelect }
