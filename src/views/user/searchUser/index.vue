<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-07 16:37:38
 -->
<template>
  <d2-container>
    <!-- 使用tab动态地切换管理员组件与用户组件 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="系统管理员" name="adminer">
      <div :is="currentComponent"></div>
    </el-tab-pane>
    <el-tab-pane label="易教育平台老师" name="teacher">
      <div :is="currentComponent"></div>
    </el-tab-pane>
    <el-tab-pane label="易教育平台用户" name="user">
      <div :is="currentComponent"></div>
    </el-tab-pane>
  </el-tabs>
  </d2-container>
</template>

<script>
import adminer from './components/adminer'
import user from './components/user'
import teacher from './components/teacher'
export default {
  name: 'searchUser',
  data () {
    return {
      activeName: 'adminer',
      currentComponent: 'adminer', // 当前展示的组件名称
      currentNum: '0'// 当前tab的索引
    }
  },
  mounted () {
    setTimeout(() => {
      this.activeName = 'adminer'
    }, 500)
  },
  methods: {
    handleClick (tab, event) {
      if (tab.index === this.currentNum) {
        return
      }
      this.currentNum = tab.index
      switch (+tab.index) {
        case 0:
          this.currentComponent = 'adminer'
          break
        case 1:this.currentComponent = 'teacher'
          break
        case 2:this.currentComponent = 'user'
          break
        default:
          break
      }
    }
  },
  components: {
    adminer,
    user,
    teacher
  }
}
</script>
