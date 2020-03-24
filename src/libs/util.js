/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-05 11:10:56
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-24 02:40:10
 */
import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'
import menuFormate from './util.menu.formate'
import netconnect from './util.netconnect'

const util = {
  cookies,
  db,
  log,
  menuFormate,
  netconnect
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = '易教育'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

export default util
