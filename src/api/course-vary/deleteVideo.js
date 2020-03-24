/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-07 20:23:36
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-23 21:54:26
 */
// 课程管理--删除课程视频
import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function deleteVideo (data) {
  return request({
    url: `videoInfo/deleteByPrimaryKey?vid=${data.vid}`,
    method: 'get'
  })
}

export { deleteVideo }
