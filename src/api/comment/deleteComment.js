/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-07 20:23:36
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-22 21:22:37
 */
// 评论管理--删除评论接口
import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function deleteComment (data) {
  return request({
    url: `comment/deleteByPrimaryKey?id=${data.id}`,
    method: 'get'
  })
}

function deleteReply (data) {
  return request({
    url: `reply/deleteByPrimaryKey?id=${data.repId}`,
    method: 'get'
  })
}
export { deleteComment, deleteReply }
