<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-22 21:30:57
 -->
<template>
  <div class="reply">
    <!-- 封装的本系统的全局表格组件 -->
    <table-page
      :tableDatas="showDatas.replyDatas"
      :tableHeader="showDatas.commentAttributs"
      :operateWay="showDatas.operateData"
      :pageInfos="showDatas.pageInfos"
      @operate="operateFun"
      @changePageSize="changeSize"
      @changCurrentePage="changPage"
    />
  </div>
</template>

<script>
import { replytSelect } from '@/api/comment/searchReply.js'
import { deleteReply } from '@/api/comment/deleteComment.js'
export default {
  name: 'reply',
  props: ['comId'],
  data () {
    return {
      searchInfo: {
        size: 6, // 分页的每一页数目
        indexPageNum: 1 // 当前分页的页码
      },
      // 页面需要渲染的数据:包括当前页面以及制作复用子组件，渲染的数据是需要传递给子组件的。
      showDatas: {
        replyDatas: [],
        // 定义表格头部数据：一般是固定自己需要的几个字段:所以可以直接在这里定义:也算是定义渲染的模板对象
        commentAttributs: [
          {
            attributes: 'repId',
            name: '回复编码',
            width: '130'
          },
          {
            attributes: 'content',
            name: '回复内容',
            width: '200'
          },
          {
            attributes: 'repTime',
            name: '回复时间',
            width: '130'
          },
          {
            attributes: 'state',
            name: '状态',
            width: ''
          }
        ],
        // 这里需要表格的尾列显示编辑、删除按钮:如果不需要显示操作列，请给它赋值false：实现是通过v-if="operateData"
        operateData: [
          {
            name: '删除',
            icon: 'el-icon-delete',
            type: 'danger' // 按钮样式类型
          }
        ],
        //  operateData:false

        // 分页信息：传递分页信息控制子组件分页器的渲染,当不需要显示分页控件的时候：比如页数为1或者是没有分页
        // 手动设置 isShowPage:false
        pageInfos: {
          totalPage: 0, // 总数
          pageSize: [], // 定义可以调整每一页显示数目
          isShowPage: false // false：不显示分页控件
        }
      }
    }
  },
  mounted () {
    this.searchComment()
  },
  methods: {
    searchComment () {
      console.log(this.searchInfo)
      let loading = this.$myLoading('查询中...')
      // 多添加查询的query过滤处理
      let data = {
        pageNum: this.searchInfo.indexPageNum,
        pageSize: this.searchInfo.size,
        comId: this.comId
      }
      // 开始查询
      replytSelect(data).then(res => {
        console.log(res)
        this.datasShow(res)
        loading.close()
      }).catch(errs => { loading.close() })
    },
    datasShow (res) {
      if (res.message === '无数据') {
        this.showDatas.replyDatas = []
      } else {
        this.showDatas.replyDatas = []
        if (Array.isArray(res.data)) {
          this.showDatas.replyDatas = res.data
          console.log(this.showDatas.repld)
          for (let i = 0; i < this.showDatas.replyDatas.length; i++) {
            this.showDatas.replyDatas[i].state = this.showDatas.replyDatas[i].state === 0 ? '正常' : '禁用'
            // 注册时间：毫秒转正常的时间格式
            this.showDatas.replyDatas[i].repTime = this.DateFormate(this.showDatas.replyDatas[i].repTime)
            for (let key in this.showDatas.replyDatas[i]) {
              if (this.showDatas.replyDatas[i][key] === null) {
                this.showDatas.replyDatas[i][key] = '暂无信息'
              }
            }
          }
        } else {
          this.showDatas.replyDatas.push(res.data)
        }
      }
      let isShow = !(res.count === 0 || res.count === 1)
      // TODO:分页总数目需要加上去
      this.showDatas.pageInfos = {
        totalPage: res.count,
        pageSize: [6, 12, 24, 36],
        isShowPage: isShow
      }
    },
    // 毫秒转时间格式
    DateFormate (time) {
      var date = new Date(time)
      return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDay() < 10 ? '0' + (date.getDay() + 1) : date.getDay() + 1}`
    },
    // 子组件通过emit触发@xxx事件，函数定义在这里，接受到子组件传递的数据之后写相关业务逻辑
    operateFun (ind, type) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let loading = this.$myLoading('正在删除...')
        let data = this.showDatas.replyDatas[ind]
        deleteReply(data).then((result) => {
          loading.close()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.searchComment()
        }).catch((error) => {
          console.log(error)
          loading.close()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteReply (data) {
      alert(0)
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
    },
    reset () {
      for (let key in this.searchInfo) {
        if (key === 'size' || key === 'indexPageNum') {
          console.log(111)
        } else {
          this.searchInfo[key] = ''
        }
      }
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
