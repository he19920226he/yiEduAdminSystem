<!--
 * @Description: 表格 + 分页组件
 * @Author: Lxiaowei
 * @Github: https://github.com/LXY-1/itemName
 * @Date: 2019-06-22 16:36:46
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-07 21:51:21
 -->
<template>
  <div class="table-page" style="width:100%!important;">
    <el-row class="d2-mb-10">
      <el-table :data="tableDatas" stripe style="width: 100%">
        <el-table-column
          v-for="(item,index) in tableHeader"
          :key="index"
          :prop="item.attributes"
          :label="item.name"
          :width="item.width"
        ></el-table-column>
        <el-table-column label="操作" width="300" v-if="operateWay">
          <template slot-scope="scope">
            <el-button
              v-for="(item1,index1) in needOperway"
              :key="index1"
              size="mini"
              :type="item1.type"
              @click="handleClick(scope.$index,item1.name)"
            >
              <i :class="item1.icon"></i>
              {{item1.name}}
            </el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"> <i class="el-icon-delete"></i> 删除
            </el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="d2-mb-10" v-if="pageInfos.isShowPage">
      <div class="block mg-top20">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageInfos.pageSize"
          :page-size="pageInfos.pageSize[0]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfos.totalPage"
        ></el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'table-page',
  // 分别：表格数据、表格头部、以及控制相关操作按钮显示：比如删除、编辑、维护、查看....,如果operateWay为空字符串那么表示不显示操作列。
  props: ['tableDatas', 'tableHeader', 'operateWay', 'pageInfos'],
  data () {
    return {
      currentPage: 1
    }
  },
  methods: {
    /**
     ** @description:  点击子组件按钮，触发父页面自定义注册的监听器(所以需要知道vue中怎么在子组件触发父* *************   组件的方法：这里总结了几种，我使用的是触发自定义事件的方式：需要在父组件使用子组* *************   件的时候在子组件标签绑定这个事件)，其他：* ************* * *************  * *************     https://juejin.im/post/5c1370365188250f73759a79 | 通过这里的回调
     ** *************  函数实现向父组件传递数据，以及在父组件具体定义相关的业务逻辑，所以父组件需要注册    ************* 一个监听器来定义具体的函数实现具体的业务逻辑以及通过定义参数接受子组件触发（回调     *************  父组件的函数)父组件自定义监听器向其传递的数据
     ** * ************  自定义事件监听以及自定义事件触发： this.$emit只能触发本实例自定义的事件监听器，
     ** * ************  但是这里是需要子组件触发父组件定义的事件监听器。所以需要使用$dispatch
     ** @param {type}
     ** @return:
     */

    handleClick (ind, type) {
      this.$emit('operate', ind, type)
    },
    handleSizeChange (val) {
      this.$emit('changePageSize', val)
    },
    handleCurrentChange (val) {
      this.$emit('changCurrentePage', val)
    }
  },
  computed: {
    needOperway: function () {
      return this.operateWay.filter(item => {
        return item.isShow || item.isShow === undefined
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mg-top20{
    margin-top:10px;
}
</style>
