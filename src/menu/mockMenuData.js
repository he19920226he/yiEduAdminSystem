/*
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-21 16:27:09
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-04 09:38:03
 */
// 模拟菜单数据
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '用户管理',
    icon: 'user',
    children: [
      { path: 'searchUser', title: '查询用户' },
      { path: 'addUser', title: '添加用户' },
      { path: 'userOrder', title: '用户订单' },
      { path: 'move', title: '拖拽排序' }
    ]
  },
  {
    title: '角色管理',
    icon: 'vcard-o',
    children: [
      { path: 'addRole', title: '添加角色' },
      { path: 'searchRole', title: '查询角色' }
    ]
  },
  {
    title: '权限管理',
    icon: 'key',
    children: [
      { path: 'addPermission', title: '添加权限' },
      { path: 'searchPermission', title: '查询权限' }
    ]
  },
  {
    title: '课程管理',
    icon: 'book',
    children: [
      { path: 'addCourse', title: '添加课程' },
      { path: 'searchCourse', title: '查询课程' },
      { path: 'VaryManager', title: '课程类别管理' }
    ]
  },
  {
    title: '积分管理',
    icon: 'file-powerpoint-o',
    children: [
      { path: 'searchIntegral', title: '查询用户积分' },
      { path: 'integralExchange', title: '积分兑换管理' }
    ]
  },
  {
    title: '评论管理',
    icon: 'comments-o',
    children: [
      { path: 'searchComment', title: '查询评论' }
    ]
  }
]
