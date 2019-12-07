<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-07 21:50:22
 -->
<template>
  <div class="adminer">
    <el-row class="d2-mb-10" :gutter="40">
      <el-col :span="6">
        <el-input
                @keyup.enter.native="searchByKeyword"
                placeholder="请输入用户手机号"
                prefix-icon="el-icon-search"
                v-model="searchInfo.phone"
        ></el-input>
      </el-col>
      <el-col :span="6">
        <el-select placeholder="请选择学生状态"  v-model="searchInfo.state" style="width:100%!important;">
          <el-option label="正常" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
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
      <el-col :span="6" style="text-align: left;padding-left: -50px!important;">
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchStudents">查询</el-button>
        <el-button  icon="el-icon-refresh" size="small" @click="reset">重置</el-button>
      </el-col>
    </el-row>
    <el-row class="d2-mb-10">
      <p class="info">用户信息</p>
    </el-row>
    <!-- 封装的本系统的全局表格组件 -->
    <table-page
      :tableDatas="showDatas.userDatas"
      :tableHeader="showDatas.userAttributs"
      :operateWay="showDatas.operateData"
      :pageInfos="showDatas.pageInfos"
      @operate="operateFun"
      @changePageSize="changeSize"
      @changCurrentePage="changPage"
    />
       <!-- 编辑管理员信息,表单组件类型很多不好像封装表格那样。所以这里就不全局封装了，数据封装一下就行 -->
    <el-dialog title="编辑管理员信息" :visible.sync="dialogFormVisible">
      <el-form :inline="true" :model="formUser" :rules="rules" ref="formUser" class="demo-form-inline">
        <el-form-item label="用户名称" prop="stuname">
          <el-input v-model="formUser.stuname" placeholder="用户名称"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="petname">
          <el-input v-model="formUser.petname" placeholder="宠物名称"></el-input>
        </el-form-item>
        <el-form-item label="用户手机号" prop="phone">
          <el-input v-model="formUser.phone" placeholder="用户手机号"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="formUser.email" placeholder="用户邮箱"></el-input>
        </el-form-item>
        <el-form-item label="用户qq" prop="qq">
          <el-input v-model="formUser.qq" placeholder="用户qq"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="stupassword">
          <el-input show-password v-model="formUser.stupassword" placeholder="用户密码"></el-input>
        </el-form-item>
          <el-form-item label="用户年龄" prop="stuage">
          <el-input  v-model.number="formUser.stuage" placeholder="用户年龄"></el-input>
        </el-form-item>
        <el-form-item label="用户性别" prop="stusex">
          <el-select v-model="formUser.stusex" placeholder="请选择用户性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户地址" prop="address" style="width:100%!important;">
          <el-input  v-model="formUser.address" placeholder="教师地址" style="width:255%!important;"></el-input>
        </el-form-item>
        <el-form-item label="用户自我介绍" prop="stuintroduce" style="width:100%!important;">
          <el-input type="textarea" v-model="formUser.stuintroduce" style="width:270%!important;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editInfo('formUser')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { studentSelect } from '@/api/user/searchUser.js'
import { updateStudent } from '@/api/user/updateUser.js'
import { deleteUser } from '@/api/user/deleteUser.js'
export default {
  name: 'user',
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!myreg.test(value)) {
          return callback(new Error('手机号格式不对'))
        }
      }
      callback()
    }
    var inputNum = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        callback()
      }
    }
    var checkEmail = (rule, value, callback) => {
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (!reg.test(value)) {
        callback(new Error('邮箱格式不对'))
      } else {
        callback()
      }
    }
    return {
      searchInfo: {
        phone: '',
        size: 6, // 分页的每一页数目
        indexPageNum: 1, // 当前分页的页码
        state: '',
        courseTime: ''
      },
      // 页面需要渲染的数据:包括当前页面以及制作复用子组件，渲染的数据是需要传递给子组件的。
      showDatas: {
        userDatas: [],
        // 定义表格头部数据：一般是固定自己需要的几个字段:所以可以直接在这里定义:也算是定义渲染的模板对象
        userAttributs: [
          {
            attributes: 'stuid',
            name: '用户编号',
            // 配置每一列的宽度，如果是为了全屏显示的话最后一个不要配置宽度
            width: '130'
          },
          {
            attributes: 'stuname',
            name: '学生名称',
            width: '130'
          },
          {
            attributes: 'stusex',
            name: '学生性别',
            width: '130'
          },
          {
            attributes: 'stuage',
            name: '学生年龄',
            width: '130'
          },
          {
            attributes: 'state',
            name: '状态',
            width: '130'
          },
          {
            attributes: 'phone',
            name: '学生电话',
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
          },
          {
            name: '自定义',
            icon: 'el-icon-s-release',
            type: 'warning' // 按钮样式类型
          }
        ],
        //  operateData:false

        // 分页信息：传递分页信息控制子组件分页器的渲染,当不需要显示分页控件的时候：比如页数为1或者是没有分页
        // 手动设置 isShowPage:false
        pageInfos: {
          totalPage: 0, // 总数
          pageSize: [10], // 定义可以调整每一页显示数目
          isShowPage: false // false：不显示分页控件
        },
        loadinInfo: {
          isLoading: false,
          info: '确定修改'
        }
      },
      dialogFormVisible: false,
      // 表单相关：数据、验证
      formUser: {
        stuid: '',
        petname: '',
        stuname: '',
        stupassword: '',
        stusex: '',
        stuage: '',
        phone: '',
        email: '',
        address: '',
        stuintroduce: '',
        qq: ''
      },
      rules: {
        stuname: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        stupassword: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        stuage: [{ required: true, message: '请输入年龄', trigger: 'blur' }, { validator: inputNum, trigger: 'blur' }],
        stusex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }],
        // 没有手机校验规则，所以自定义校验规则
        phone: [
          { validator: checkPhone, trigger: 'blur' },
          { required: true, message: '请输入用户手机号', trigger: 'blur' }
        ],
        address: [{ required: true, message: '请输入地址', trigger: 'change' }],
        stuintroduce: [
          { required: true, message: '请输入个人简介', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.searchStudents()
  },
  methods: {
    searchStudents () {
      let loading = this.$myLoading('查询中...')
      // 多添加查询的query过滤处理
      let data = this.getQuery()
      // 开始查询
      studentSelect(data).then(res => {
        console.log(res)
        this.datasShow(res)
        loading.close()
      }).catch(errs => { loading.close() })
    },
    datasShow (res) {
      if (res.message === '无数据') {
        this.showDatas.userDatas = []
      } else {
        this.showDatas.userDatas = []
        if (Array.isArray(res.data)) {
          this.showDatas.userDatas = res.data
          for (let i = 0; i < this.showDatas.userDatas.length; i++) {
            this.showDatas.userDatas[i].state = this.showDatas.userDatas[i].state === 0 ? '正常' : '禁用'
            for (let key in this.showDatas.userDatas[i]) {
              if (this.showDatas.userDatas[i][key] === null) {
                this.showDatas.userDatas[i][key] = '暂无信息'
              }
            }
          }
        } else {
          this.showDatas.userDatas.push(res.data)
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
    getQuery () {
      // 根据不为空的字段获取实际的query
      let obj = {}
      for (let key in this.searchInfo) {
        if (this.searchInfo[key] !== '') {
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
    searchByKeyword () {
      this.searchStudents()
    },
    // 子组件通过emit触发@xxx事件，函数定义在这里，接受到子组件传递的数据之后写相关业务逻辑
    operateFun (ind, type) {
      if (type === '编辑') {
        let loading = this.$myLoading('数据加载中...')
        loading.close()
        this.dialogFormVisible = !this.dialogFormVisible
        //! 信息回显到表单:注意表格的一条记录数据从后台获取，但是我们通过字段过滤显示部分数据。但是记录里面是全部的信息，目的是为了
        //! 回显信息到表单。
        let curetnInfo = this.showDatas.userDatas[ind]
        for (const key in this.formUser) {
          if (this.formUser.hasOwnProperty(key)) {
            this.formUser[key] = curetnInfo[key]
          }
        }
      } else if (type === '删除') {
        //  删除信息
        console.log(this.showDatas.userDatas[ind].stuid)
        this.$confirm('此操作将删除管理员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let loading = this.$myLoading('删除中...')
            let data = {
              id: this.showDatas.userDatas[ind].stuid
            }
            deleteUser(data).then(res => {
              loading.close()
              this.searchStudents()
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
      } else if (type === '禁用') {
        console.log(type)
        this.$confirm('此操作将冻结该学生使用本平台客户端, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            console.log(this.showDatas.userDatas[ind].stuid)
            let loading = this.$myLoading('删除中...')
            let data = {
              stuid: this.showDatas.userDatas[ind].stuid,
              state: 1
            }
            updateStudent(data).then(res => {
              loading.close()
              this.searchStudents()
            }).catch(errs => {
              loading.close()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消禁用'
            })
          })
      } else if (type === '启用') {
        console.log(type)
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
    reset () {
      for (let key in this.searchInfo) {
        if (key === 'size' || key === 'indexPageNum') {
          console.log(111)
        } else {
          this.searchInfo[key] = ''
        }
      }
    },
    editInfo (formName) {
      // 点击确定进行表单验证
      this.$refs[formName].validate((valid) => {
        console.log(valid)
        if (valid) {
          console.log(this.formUser)
          let loading = this.$myLoading('修改中...')
          updateStudent(this.formUser).then(res => {
            loading.close()
            console.log(res)
            this.searchStudents()
            this.dialogFormVisible = false
          }).catch(errs => {
            loading.close()
          })
        } else {
          this.$message.error('输入内容有误，请检查对应输入框')
          return false
        }
      })
    }
  }
}
</script>
