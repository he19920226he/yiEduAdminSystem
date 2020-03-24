/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-05 11:10:56
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-04 09:37:03
 */
import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/** FIXME:
 * 在主框架内显示:TODO:路由的控制，页面是肯定有的，
 * 但是如果这里是写死的话，无法实现动态控制路由，比如把一个子模块移动到另一个父级模块
 * 后台记录权限的变化，菜单栏通过后台渲染可以显示变化，暂时写成只能修改不涉及到路由地址的地方。
 */

//! 根据后台传过来的数据来动态渲染路由 [{permissioninfo}]

const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          auth: true
        },
        component: _import('system/index')
      },
      // 用户管理相关页面
      {
        path: 'searchUser',
        name: 'searchUser',
        meta: {// 标签栏显示
          title: '查询用户',
          auth: true
        },
        component: _import('user/searchUser')
      },
      {
        path: 'addUser',
        name: 'addUser',
        meta: {// 标签栏显示
          title: '添加用户',
          auth: true
        },
        component: _import('user/addUser')
      },
      {
        path: 'userOrder',
        name: 'userOrder',
        meta: {// 标签栏显示
          title: '用户订单信息',
          auth: true
        },
        component: _import('user/userOrder')
      },
      // 角色管理模块
      {
        path: 'addRole',
        name: 'addRole',
        meta: {// 标签栏显示
          title: '添加角色',
          auth: true
        },
        component: _import('role/addRole')
      },
      {
        path: 'searchRole',
        name: 'searchRole',
        meta: {// 标签栏显示
          title: '查询角色',
          auth: true
        },
        component: _import('role/searchRole')
      },
      // 权限管理模块
      {
        path: 'addPermission',
        name: 'addPermission',
        meta: {// 标签栏显示
          title: '添加权限',
          auth: true
        },
        component: _import('permission/addPermission')
      },
      {
        path: 'searchPermission',
        name: 'searchPermission',
        meta: {// 标签栏显示
          title: '查询权限',
          auth: true
        },
        component: _import('permission/searchPermission')
      },
      // 课程管理模块
      {
        path: 'addCourse',
        name: 'addCourse',
        meta: {// 标签栏显示
          title: '添加课程',
          auth: true
        },
        component: _import('course/addCourse')
      },
      {
        path: 'searchCourse',
        name: 'searchCourse',
        meta: {// 标签栏显示
          title: '查询课程',
          auth: true
        },
        component: _import('course/searchCourse')
      },
      {
        path: 'VaryManager',
        name: 'VaryManager',
        meta: {// 标签栏显示
          title: '分类管理',
          auth: true
        },
        component: _import('course/VaryManager')
      },
      {
        path: 'addVary',
        name: 'addVary',
        meta: {// 标签栏显示
          title: '添加分类',
          auth: true
        },
        component: _import('course/addVary')
      },
      // 积分管理模块
      {
        path: 'searchIntegral',
        name: 'searchIntegral',
        meta: {// 标签栏显示
          title: '查询用户积分',
          auth: true
        },
        component: _import('integral/searchIntegral')
      },
      {
        path: 'integralExchange',
        name: 'integralExchange',
        meta: {// 标签栏显示
          title: '积分兑换',
          auth: true
        },
        component: _import('integral/integralExchange')
      },
      // 评论管理模块
      {
        path: 'searchComment',
        name: 'searchComment',
        meta: {// 标签栏显示
          title: '查询用户评论',
          auth: true
        },
        component: _import('comment/searchComment')
      },
      // 测试页面
      {
        path: 'test',
        name: 'test',
        meta: {// 标签栏显示
          title: '新页面',
          auth: true
        },
        component: _import('comment/test')
      },
      {
        path: 'move',
        name: 'move',
        meta: {// 标签栏显示
          title: '拖拽排序实现',
          auth: true
        },
        component: _import('user/move')
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
