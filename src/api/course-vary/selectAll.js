
import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function selectAllVary () {
  return request({
    url: `kindInfo/selectAll?pageNum=1&pageSize=100`,
    method: 'get'
  })
}

export { selectAllVary }
