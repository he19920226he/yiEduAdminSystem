import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload uUserData {String} 用户相关信息
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    // 目前是在登录页面就开始调用后台的登录接口，如果登录成功了就跳转到这里执行uid和token的存储以保存登录状态，还有一些个人信息数据的持久化和更新 */
    login ({ dispatch }, {
      UserData = {} // 登录成功之后把需要的信息传来这里
    } = {}) {
      (async function () {
        // TODO:设置 cookie 一定要存 uuid 和 token 两个 cookie
        // 整个系统依赖这两个数据进行校验和存储
        // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
        // token 代表用户当前登录状态 建议在网络请求中携带 token
        // 如有必要 token 需要定时更新，默认保存一天
        // 后台获取userid赋值uuid，使用框架提供的实现一个区分用户的数据持久化需要这个不同的uuid，
        // 后台没有返回token的的话，使用一个唯一标识
        util.cookies.set('uuid', UserData.id)
        util.cookies.set('token', UserData.id)
        util.cookies.set('usaccount', UserData.name)
        util.cookies.set('uspassword', UserData.password)
        util.cookies.set('roleid', UserData.roleId)

        // 设置 vuex 用户信息
        await dispatch('d2admin/user/set', {
          name: UserData.name
        }, { root: true })
        // 用户登录后从持久化数据加载一系列的设置
        await dispatch('load')
        router.push({
          name: 'index'
        })
      })()
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout () {
        // 删除cookie
        util.cookies.remove('token')
        util.cookies.remove('uuid')
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set', {}, { root: true })
        // 跳转路由
        router.push({
          name: 'login'
        })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm('确定要注销当前用户吗', '注销用户', {
          type: 'warning'
        })
          .then(() => {
            commit('d2admin/gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            Message({
              message: '取消注销操作'
            })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    load ({ dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 加载用户名
        await dispatch('d2admin/user/load', null, { root: true })
        // DB -> store 加载主题
        await dispatch('d2admin/theme/load', null, { root: true })
        // DB -> store 加载页面过渡效果设置
        await dispatch('d2admin/transition/load', null, { root: true })
        // DB -> store 持久化数据加载上次退出时的多页列表
        await dispatch('d2admin/page/openedLoad', null, { root: true })
        // DB -> store 持久化数据加载侧边栏折叠状态
        await dispatch('d2admin/menu/asideCollapseLoad', null, { root: true })
        // DB -> store 持久化数据加载全局尺寸
        await dispatch('d2admin/size/load', null, { root: true })
        // DB -> store 持久化数据加载颜色设置
        await dispatch('d2admin/color/load', null, { root: true })
        // end
        resolve()
      })
    }
  }
}
