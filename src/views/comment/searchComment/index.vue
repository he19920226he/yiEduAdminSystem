<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-23 23:09:17
 -->
<template>
  <d2-container>
    <template slot="header">查询用户评论</template>
    <div class="searchComment">
      <el-row class="d2-mb-10" :gutter="40">
        <el-col :span="4">
          <el-select placeholder="请选择评论状态"  v-model="searchInfo.state" style="width:100%!important;">
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select placeholder="请选择学生"  v-model="searchInfo.stuid" style="width:100%!important;">
            <el-option label="学生1" value="0"></el-option>
            <el-option label="学生2" value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select placeholder="请选择课程"  v-model="searchInfo.cid" style="width:100%!important;">
            <el-option label="课程一" value="0"></el-option>
            <el-option label="课程二" value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
                  style="width:90%!important;"
                  v-model="searchInfo.courseTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="4" style="text-align: left;padding-left: -50px!important;">
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchComment">查询</el-button>
          <el-button  icon="el-icon-refresh" size="small" @click="reset">重置</el-button>
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
      <!-- 查看回复评论的内容-->
      <el-dialog title="查看回复" :visible.sync="dialogFormVisible">
<!-- 回复评论列表组件 -->
         <reply :comId="comid" v-if="dialogFormVisible"></reply>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import { commentSelect } from '@/api/comment/searchComment.js'
import { deleteComment } from '@/api/comment/deleteComment.js'
import reply from './compoment/reply'

export default {
  name: 'searchComment',
  data () {
    return {
      dialogFormVisible: false,
      comid: '', // 选择的评论id
      searchInfo: {
        state: '',
        stuid: '',
        cid: '',
        courseTime: '',
        size: 6, // 分页的每一页数目
        indexPageNum: 1 // 当前分页的页码
      },
      // 页面需要渲染的数据:包括当前页面以及制作复用子组件，渲染的数据是需要传递给子组件的。
      showDatas: {
        commentDatas: [],
        // 定义表格头部数据：一般是固定自己需要的几个字段:所以可以直接在这里定义:也算是定义渲染的模板对象
        commentAttributs: [
          {
            attributes: 'comId',
            name: '评论编码',
            width: '200'
          },
          {
            attributes: 'cid',
            name: '课程编码',
            width: '200'
          },
          {
            attributes: 'content',
            name: '评论内容',
            width: '250'
          },
          {
            attributes: 'comTime',
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
        },
        replayDatas: []// 回复评论
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
      let data = this.getQuery()
      // 开始查询
      commentSelect(data).then(res => {
        console.log(res)
        this.datasShow(res)
        loading.close()
      }).catch(errs => { loading.close() })
    },
    datasShow (res) {
      if (res.message === '无数据') {
        this.showDatas.commentDatas = []
      } else {
        this.showDatas.commentDatas = []
        if (Array.isArray(res.data)) {
          this.showDatas.commentDatas = res.data
          for (let i = 0; i < this.showDatas.commentDatas.length; i++) {
            this.showDatas.commentDatas[i].state = this.showDatas.commentDatas[i].state === 0 ? '正常' : '禁用'
            // 注册时间：毫秒转正常的时间格式
            this.showDatas.commentDatas[i].comTime = this.DateFormate(this.showDatas.commentDatas[i].comTime)
            for (let key in this.showDatas.commentDatas[i]) {
              if (this.showDatas.commentDatas[i][key] === null) {
                this.showDatas.commentDatas[i][key] = '暂无信息'
              }
            }
          }
        } else {
          this.showDatas.commentDatas.push(res.data)
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
    getQuery () {
      // 根据不为空的字段获取实际的query
      // TODO:目前这里的接口只支持一个state和分页，还有一个其他的包含三个条件查询的接口：要求：合并到一个接口。
      let obj = {}
      for (let key in this.searchInfo) {
        if (this.searchInfo[key] !== '' && this.searchInfo[key] !== null) {
          if (key === 'size') {
            obj['pageSize'] = this.searchInfo[key]
          } else if (key === 'indexPageNum') {
            obj['pageNum'] = this.searchInfo[key]
          } else if (key === 'courseTime') {
            obj['beforeDate'] = this.searchInfo[key][0]
            obj['afterDate'] = this.searchInfo[key][1]
            console.log(this.searchInfo[key])
          } else {
            obj[key] = this.searchInfo[key]
          }
        }
      }
      console.log(obj)
      return obj
    },
    // 子组件通过emit触发@xxx事件，函数定义在这里，接受到子组件传递的数据之后写相关业务逻辑
    operateFun (ind, type) {
      console.log(ind)
      console.log(this.showDatas.commentDatas[ind].comId)
      if (type === '删除') {
        this.$confirm('此操作将删除该评论, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let loading = this.$myLoading('删除中...')
            let data = {
              id: this.showDatas.commentDatas[ind].comId
            }
            deleteComment(data).then(res => {
              loading.close()
              this.searchComment()
            }).catch(errs => {
              loading.close()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else if (type === '查看回复') {
        this.dialogFormVisible = true
        // 现实组件，传递当前的评论id
        this.comid = this.showDatas.commentDatas[ind].comId
      }
    },
    /**
     * @description:改变每页显示的条数，重新发送请求。
     * @param {type}
     * @return:
     */
    changeSize (size) {
      console.log(`每页 ${size} 条`)
      this.searchInfo.size = size
      this.searchComment()
    },
    /**
     * @description: 改变当前的页码
     * @param {type}
     * @return:
     */
    changPage (currentPage) {
      console.log(`当前页码:${currentPage}`)
      this.searchInfo.indexPageNum = currentPage
      this.searchComment()
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

  },
  components: {
    reply
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
