<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-20 19:40:19
 -->
<template>
  <d2-container>
    <template slot="header">课程查询</template>
    <div class="searchCourse">
      <el-row class="d2-mb-10" :gutter="40">
        <el-col :span="6">
          <el-input
            @keyup.enter.native="searchByKeyword"
            placeholder="请输入课程相关信息"
            prefix-icon="el-icon-search"
            v-model="searchInfo.keyword"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-select placeholder="请选择课程一级类别" style="width:100%!important;">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select placeholder="请选择课程二级类别" style="width:100%!important;">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            style="width:90%!important;"
            v-model="searchInfo.courseTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>
      </el-row>
      <el-row class="d2-mb-10">
        <p class="info">课程信息</p>
      </el-row>
      <!-- 封装的本系统的全局表格组件 -->
      <table-page
        :tableDatas="showDatas.courseDatas"
        :tableHeader="showDatas.courseAttributs"
        :operateWay="showDatas.operateData"
        :pageInfos="showDatas.pageInfos"
        @operate="operateFun"
        @changePageSize="changeSize"
        @changCurrentePage="changPage"
      />

      <!-- TODO:看看这里的备注：关于进入课程的编辑页面：tab:分为基本信息编辑、课程视频编辑、课程试题编辑。这样课程列表的操作：编辑、删除编辑管理员信息,表单组件类型很多不好像封装表格那样。所以这里就不全局封装了，数据封装一下就行 -->
      <el-dialog title="编辑课程信息" :visible.sync="dialogFormVisible">
        <el-tabs v-model="activeName" @tab-click="handleClick">

          <el-tab-pane label="课程基本信息" name="first">
 <el-form
        :model="formCourse"
        :rules="rules"
        ref="formCourse"
        class="demo-form-inline"
      >
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="一级类别" prop="Parentkid" style="width:100%!important;">
              <el-select v-model="formCourse.Parentkid" placeholder="请选择一级类别" style="width:100%!important;">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级类别" prop="kid" style="width:100%!important;">
              <el-select v-model="formCourse.kid" placeholder="请选择二级类别" style="width:100%!important;">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="课程名" prop="cname">
              <el-input v-model="formCourse.cname " placeholder="课程名字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总分数" prop="score">
              <el-input v-model.number="formCourse.score" placeholder="课程总分数"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="课程时长" prop="crouse_time">
              <el-input v-model.number="formCourse.crouse_time" placeholder="课程时长"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程价格" prop="price">
              <el-input v-model.number="formCourse.price" placeholder="课程价格"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="积分值" prop="integral">
              <el-input v-model="formCourse.integral" placeholder="课程积分值"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程介绍" prop="crouse_introduce">
              <el-input type="textarea" v-model="formCourse.crouse_introduce" placeholder="课程介绍"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
          </el-tab-pane>
          <el-tab-pane label="课程视频" name="second">课程视频</el-tab-pane>
          <el-tab-pane label="课程试题" name="third">课程试题</el-tab-pane>
        </el-tabs>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import getMenuIcons from '../../../menu/menuIcon'
export default {
  name: 'searchCourse',
  data () {
    return {
      searchInfo: {
        courseTime: '', // 课程创建时间段
        keyword: '',
        size: '', // 分页的每一页数目
        indexPageNum: '' // 当前分页的页码
      },
      // 页面需要渲染的数据:包括当前页面以及制作复用子组件，渲染的数据是需要传递给子组件的。
      showDatas: {
        courseDatas: [],
        // 定义表格头部数据：一般是固定自己需要的几个字段:所以可以直接在这里定义:也算是定义渲染的模板对象
        courseAttributs: [
          {
            attributes: 'cid',
            name: '课程编码',
            // 配置每一列的宽度，如果是为了全屏显示的话最后一个不要配置宽度
            width: '250'
          },
          {
            attributes: 'cname ',
            name: '课程名称',
            width: '250'
          },
          {
            attributes: 'score ',
            name: '课程总分数',
            width: '250'
          },
          {
            attributes: 'crouse_time',
            name: '课程时长',
            width: ''
          }
        ],
        // 这里需要表格的尾列显示编辑、删除按钮:如果不需要显示操作列，请给它赋值false：实现是通过v-if="operateData"
        operateData: [
          {
            name: '编辑',
            icon: 'el-icon-edit',
            type: '' // 按钮样式类型
          },
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
          pageSize: [6], // 定义可以调整每一页显示数目
          isShowPage: false // false：不显示分页控件
        },
        loadinInfo: {
          isLoading: false,
          info: '确定修改'
        }
      },
      dialogFormVisible: true,
      // 表单相关：数据、验证
      formCourse: {
        Parentkid: '',
        kid: '',
        cname: '', // 课程名
        score: '', // 课程成绩
        crouse_time: '', // 课程时长
        price: '', // 课程价格
        integral: '', // 积分值
        crouse_introduce: '' // 课程介绍
      },
      rules: {
        Parentkid: [
          {
            required: true, message: '请选择课程一级类别', trigger: 'change'
          }
        ],
        kid: [
          {
            required: true, message: '请选择课程二级类别', trigger: 'change'
          }
        ],
        cname: [{ required: true, message: '请输入课程名字', trigger: 'blur' }],
        score: [
          { required: true, message: '请输入课程成绩', trigger: 'blur' },
          { type: 'number', message: '分数必须为数字' }
        ],
        crouse_time: [
          { required: true, message: '请输入课程时长', trigger: 'blur' },
          { type: 'number', message: '时长必须为数字' }
        ],
        price: [
          { required: true, message: '请输入课程价格', trigger: 'blur' },
          { type: 'number', message: '价格必须为数字' }
        ],
        integral: [
          { required: true, message: '请输入课程积分', trigger: 'blur' },
          { type: 'number', message: '积分必须为数字' }
        ],
        crouse_introduce: [
          { required: true, message: '请输入课程介绍', trigger: 'blur' }
        ]
      },
      menuIcons: [],
      activeName: 'first'
    }
  },
  mounted () {
    let loading = this.$myLoading('切换中')
    setTimeout(() => {
      loading.close()
      this.menuIcons = getMenuIcons()
    }, 500)
  },
  methods: {
    searchByKeyword () {
      console.log(this.searchInfo.keyword)
    },
    // 子组件通过emit触发@xxx事件，函数定义在这里，接受到子组件传递的数据之后写相关业务逻辑
    operateFun (ind, type) {
      if (type === '编辑') {
        let loading = this.$myLoading('数据加载中...')
        loading.close()
        this.dialogFormVisible = !this.dialogFormVisible
        //! 信息回显到表单:注意表格的一条记录数据从后台获取，但是我们通过字段过滤显示部分数据。但是记录里面是全部的信息，目的是为了
        //! 回显信息到表单。
        let curetnInfo = this.showDatas.roleDatas[ind]
        console.log(curetnInfo['id'])
        for (const key in this.formRole) {
          if (this.formRole.hasOwnProperty(key) && key !== 'permisionIds') {
            this.formRole[key] = curetnInfo[key]
          }
        }
      } else {
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
