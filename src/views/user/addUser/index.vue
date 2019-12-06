<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-07 17:41:36
 -->
<template>
  <d2-container>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="添加系统管理员" name="adminer">
        <div :is="currentComponent"></div>
      </el-tab-pane>
      <el-tab-pane label="添加易教育平台老师" name="teacher">
        <div :is="currentComponent"></div>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>
import adminer from './components/adminer'
import teacher from './components/teacher'
export default {
  name: 'searchUser',
  data () {
    return {
      activeName: 'adminer',
      currentComponent: 'adminer',
      currentNum: '0'
    }
  },
  mounted () {},
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
        case 1:
          this.currentComponent = 'teacher'
          break
        case 2:
          this.currentComponent = 'user'
          break
        default:
          break
      }
    }
  },
  components: {
    adminer,
    teacher
  }
}
</script>
