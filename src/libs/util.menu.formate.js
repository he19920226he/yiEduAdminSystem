/*
 * @Description: 菜单数据结构转换相关方法
 * @version:
 * @Author: lxw
 * @Date: 2019-11-21 20:01:43
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-21 20:02:59
 */
/**
 * @name:
 * @description: 将后台扁平化的菜单数组数据转换成我需要的层次菜单结构
 * @msg:
 * @param {type} 权限菜单数据
 * @return:
 */
function mapMenuData (originDatas) {
  const finalMenus = originDatas.reduce((pre, cur, index, arr) => {
    if (index === 0) {
      pre.push({ path: '/index', title: '首页', icon: 'home' })
      pre.push({
        title: cur.parenttitle,
        icon: cur.icon,
        children: [
          {
            path: cur.url,
            title: cur.title
          }
        ]
      })
      return pre
    } else {
      let bol = false// 是否存在同意一模块的
      for (let i = 0; i < pre.length; i++) {
        const element = pre[i]
        if (element.title === cur.parenttitle) {
          bol = true
          element.children.push(
            {
              path: cur.url,
              title: cur.title
            }
          )
        }
      }
      if (!bol) {
        pre.push({
          title: cur.parenttitle,
          icon: cur.icon,
          children: [
            {
              path: cur.url,
              title: cur.title
            }
          ]
        })
      }
      return pre
    }
  }, [])
  return finalMenus
}

export default mapMenuData
