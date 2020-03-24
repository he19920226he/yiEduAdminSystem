// 评论管理--查询回复接口

import request from '@/plugin/axios'

// 根据不同的条件查询教师，如果字段为空不要传
function replytSelect (data) {
  return request({
    url: `reply/selects?comId=${data.comId}`,
    method: 'get'
  })
}

export { replytSelect }
