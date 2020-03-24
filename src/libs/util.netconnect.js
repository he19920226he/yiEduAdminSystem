/*
 * @Description:监听网络变化
 * @version:
 * @Author: lxw
 * @Date: 2020-03-20 21:52:07
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-24 02:37:47
 */

const eventUtil = {
  addHandler: function (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false)
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler)
    } else {
      element['on' + type] = handler
    }
  }
}
/**
   * @name:
   * @description: 调用时间绑定的兼容性封装的对象方法，监听网络变化，饭返回回调函数
   * @msg:
   * @param {Function} onlineFun | 当联网的时候触发的回调
   * * @param {Function} offlineFun | 当断网的时候触发的回调
   * @return:
   */
export default function isConnect (onlineFun, offlineFun) {
  eventUtil.addHandler(window, 'online', function () {
    onlineFun()
  })
  eventUtil.addHandler(window, 'offline', function () {
    offlineFun()
  })
}
