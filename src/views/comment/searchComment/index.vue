<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-20 21:48:37
 -->
<template>
  <d2-container>
    <template slot="header">查询用户评论</template>
    <div class="searchComment">
      <el-row class="d2-mb-10" :gutter="40">
        <el-col :span="8">
          <el-input
            @keyup.enter.native="searchByKeyword"
            placeholder="请输入评论相关信息"
            prefix-icon="el-icon-search"
            v-model="searchInfo.keyword"
          ></el-input>
        </el-col>
      </el-row>
      <el-row class="d2-mb-10">
        <p class="info">评论信息</p>
      </el-row>
      <!-- 封装的本系统的全局表格组件 -->
      <table-page
        :tableDatas="showDatas.commentDatas"
        :tableHeader="showDatas.commentAttributs"
        :operateWay="showDatas.operateData"
        :pageInfos="showDatas.pageInfos"
        @operate="operateFun"
        @changePageSize="changeSize"
        @changCurrentePage="changPage"
      />

    </div>
  </d2-container>
</template>

<script>
export default {
  name: 'searchComment',
  data () {
    return {
      searchInfo: {
        keyword: '',
        size: '', // 分页的每一页数目
        indexPageNum: '' // 当前分页的页码
      },
      // 页面需要渲染的数据:包括当前页面以及制作复用子组件，渲染的数据是需要传递给子组件的。
      showDatas: {
        commentDatas: [],
        // 定义表格头部数据：一般是固定自己需要的几个字段:所以可以直接在这里定义:也算是定义渲染的模板对象
        commentAttributs: [
          {
            attributes: 'stuid',
            name: '评论用户',
            width: '200'
          },
          {
            attributes: 'cid',
            name: '评论课程',
            width: '200'
          },
          {
            attributes: 'content',
            name: '评论内容',
            width: '250'
          },
          {
            attributes: 'com_time',
            name: '发表时间',
            width: '200'
          },
          {
            attributes: 'state',
            name: '状态',
            width: '100'
          }
        ],
        // 这里需要表格的尾列显示编辑、删除按钮:如果不需要显示操作列，请给它赋值false：实现是通过v-if="operateData"
        operateData: [
          {
            name: '删除',
            icon: 'el-icon-delete',
            type: 'danger' // 按钮样式类型
          },
          {
            name: '查看回复',
            icon: 'el-icon-chat-dot-round',
            type: 'info' // 按钮样式类型
          }
        ],
        //  operateData:false

        // 分页信息：传递分页信息控制子组件分页器的渲染,当不需要显示分页控件的时候：比如页数为1或者是没有分页
        // 手动设置 isShowPage:false
        pageInfos: {
          totalPage: 0, // 总数
          pageSize: [], // 定义可以调整每一页显示数目
          isShowPage: false // false：不显示分页控件
        },
        loadinInfo: {
          isLoading: false,
          info: '确定修改'
        }
      }
    }
  },
  mounted () {
    let loading = this.$myLoading('切换中')
    setTimeout(() => {
      loading.close()
      this.showDatas.commentDatas.push({
        stuid: '小米',
        cid: '移动端开发',
        content: '谁他妈买小米',
        com_time: '2019.03.09',
        state: '正常'

      })
    }, 500)
  },
  methods: {
    searchByKeyword () {
      console.log(this.searchInfo.keyword)
    },
    // 子组件通过emit触发@xxx事件，函数定义在这里，接受到子组件传递的数据之后写相关业务逻辑
    operateFun (ind, type) {
      //  删除信息
      this.$confirm('此操作将删除管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除管理员
          let adminerId = this.showDatas.adminerDatas[ind].id
          console.log(adminerId)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /**
     * @description:改变每页显示的条数，重新发送请求。
     * @param {type}
     * @return:
     */
    changeSize (size) {
      console.log(`每页 ${size} 条`)
      this.searchInfo.size = size
      this.searchByKeyword()
    },
    /**
     * @description: 改变当前的页码
     * @param {type}
     * @return:
     */
    changPage (currentPage) {
      console.log(`当前页码:${currentPage}`)
      this.searchInfo.indexPageNum = currentPage
      this.searchByKeyword()
    },
    handleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
      //! value就是当前被分配的所有的权限id
    }
  }
}
</script>
<style lang="css" scoped>
.icon-list {
  overflow: hidden;
  list-style: none;
  padding: 0 !important;
  width: 100%;
}
.icon-list li {
  float: left;
  width: 14%;
  text-align: center;
  height: 101px;
  padding-top: 40px;
  color: #666;
  font-size: 13px;
  border: 1px solid #ddd;
  margin-right: -1px;
  margin-bottom: -1px;
  cursor: pointer;
}
.icon-list li span {
  line-height: normal;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  color: #99a9bf;
  transition: color 0.15s linear;
}
.icon-list li i {
  display: block;
  font-size: 32px;
  margin-bottom: 15px;
  color: #606266;
  transition: color 0.15s linear;
}
.icon-list li .icon-name {
  display: inline-block;
  padding: 0 3px;
  height: 1em;
  transition: color 0.15s linear;
}
.icon-list li:hover i {
  color: #1989fa !important;
}
.icon-list li:hover span {
  color: #1989fa !important;
}
</style>
