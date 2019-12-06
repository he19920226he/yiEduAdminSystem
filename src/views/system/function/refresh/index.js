/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-05 11:10:56
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-21 10:38:36
 */
export default {
  beforeRouteEnter (to, from, next) {
    next(instance => instance.$router.replace(from.fullPath))
  },
  render: h => h()
}
