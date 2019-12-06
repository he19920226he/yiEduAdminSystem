/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-05 11:10:56
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-21 17:04:15
 */
// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'

// 菜单和路由设置
import router from './router'
import menuHeader from '@/menu/header'
import { frameInRoutes } from '@/router/routes'
// import { Message } from 'element-ui'

Vue.prototype.$myLoading = function (string) {
  return Vue.prototype.$loading({
    lock: true,
    text: string,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

// TODO:导入登录判断接口调用模块，判断是否登录
let isLogin = false
if (!isLogin) {

  // 提示登录已经过期，请重新登录
  // Message({
  //   message: '登录已经过期，请重新登录',
  //   type: 'info',
  //   duration: 5 * 1000
  // })
  // TODO:
}

// 核心插件
Vue.use(d2Admin)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  async created () {
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
    // 设置顶栏菜单
    this.$store.commit('d2admin/menu/headerSet', menuHeader)
    // TODO :设置侧边栏菜单TODO:侧边栏菜单的数据源数据是从Aside静态数据获取的，每次刷新的时候获取里面的静态数据进行赋值菜单栏。这里我们需要简单改一下menuAside：首先它是
    //! 静态的，所以我们需要从后台获取整理好菜单数据后持久化，再暴露出菜单数据。以后更新菜单的时候除了调用更新菜单的方法还要重新对菜单数据进行持久化。
    const db = await this.$store.dispatch('d2admin/db/database')
    const menuDatas = db.get('menus').value()
    console.log(menuDatas)
    this.$store.commit('d2admin/menu/asideSet', JSON.parse(menuDatas))
    // 初始化菜单搜索功能
    this.$store.commit('d2admin/search/init', menuHeader)
  },
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  }
}).$mount('#app')
