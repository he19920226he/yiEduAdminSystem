/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-10 09:09:20
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-25 14:16:15
 */
// 更新课程信息接口：基本信息更新 + 课程视频更新
import request from '@/plugin/axios'

// 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
function updateCourseBase (data) {
  return request({
    url: `crouseInfo/updateByPrimaryKey`,
    method: 'post',
    data
  })
}

export { updateCourseBase }
