
import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function getVideoByCid (data) {
  return request({
    url: `videoInfo/selectByCid?cid=${data.cid}`,
    method: 'get'
  })
}

export { getVideoByCid }
