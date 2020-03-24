// 更新课程类别信息接口
import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function updateVary (data) {
  return request({
    url: `kindInfo/updateByPrimaryKey`,
    method: 'post',
    data
  })
}

export { updateVary }
