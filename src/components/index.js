/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-05 11:10:56
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-07 08:48:57
 */
import Vue from 'vue'

import d2Container from './d2-container'
import TablePage from './TablePage'

// 注意 有些组件使用异步加载会有影响
Vue.component('d2-container', d2Container)
Vue.component('d2-icon', () => import('./d2-icon'))
Vue.component('d2-icon-svg', () => import('./d2-icon-svg/index.vue'))
Vue.component('table-page', TablePage)
console.log('-----管理全局组件的注册.js----')
