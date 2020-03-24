/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-07 15:17:08
 * @LastEditors  : lxw
 * @LastEditTime : 2019-12-25 16:10:24
 */
// 查詢用戶訂單：兩個接口：分頁查詢所有、多條件組合查詢

import request from '@/plugin/axios'

// 查询所有訂單
function managerSelectAll (data) {
  return request({
    url: `orderInfo/selectAll?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'get'
  })
}

// 跟不同的条件查询訂單，data對象裏面只保存不爲空的查詢條件字段
function multiCriteriaQuery (data) {
  // 此时的data里面只包含有数据的查询状态 pageNum=1&pageSize=10&phone=1&state=1&beforeDate=1&afterDate=1
  let query = ''
  for (let key in data) {
    query += `${key}=${data[key]}&`
  }
  query = query.slice(0, query.length - 1)
  console.log(query)
  return request({
    url: `orderInfo/multiCriteriaQuery?${query}`,
    method: 'get'
  })
}

export { managerSelectAll, multiCriteriaQuery }
