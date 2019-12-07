<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-07 21:52:04
 -->
<template>
  <div class="adminer">
    <el-row class="d2-mb-10" :gutter="20">
      <el-col :span="8">
        <el-input
          @keyup.enter.native="searchByKeyword"
          placeholder="请输入管理员手机号"
          prefix-icon="el-icon-search"
          v-model="searchInfo.keyword"
        ></el-input>
      </el-col>
    </el-row>
    <el-row class="d2-mb-10">
      <p class="info">管理员信息</p>
    </el-row>
    <!-- 封装的本系统的全局表格组件 -->
    <table-page
      :tableDatas="showDatas.adminerDatas"
      :tableHeader="showDatas.adminerAttributs"
      :operateWay="showDatas.operateData"
      :pageInfos="showDatas.pageInfos"
      @operate="operateFun"
      @changePageSize="changeSize"
      @changCurrentePage="changPage"
    />

    <!-- 编辑管理员信息,表单组件类型很多不好像封装表格那样。所以这里就不全局封装了，数据封装一下就行 -->
    <el-dialog title="编辑管理员信息" :visible.sync="dialogFormVisible">
      <el-form :inline="true" :model="formAdminer" :rules="rules" ref="formAdminer" class="demo-form-inline">
        <el-form-item label="管理员名称" prop="name">
          <el-input v-model="formAdminer.name" placeholder="管理员名称"></el-input>
        </el-form-item>
        <el-form-item label="管理员手机号" prop="phone">
          <el-input v-model="formAdminer.phone" placeholder="管理员手机号"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input show-password v-model="formAdminer.password" placeholder="管理员密码"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select diasabled
                  v-model="formAdminer.roleId"
                  placeholder="请选择分配给管理员的角色"
                  style="width: 100%;"
          >
            <el-option
                    v-for="(item,index) in roles"
                    :key="index"
                    :label="item.name"
                    :value="item.roleId"
                    :disabled="true"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { managerSelectAll, managerSelectByPhone } from '@/api/user/searchUser.js'
import { updateUser } from '@/api/user/updateUser.js'
import { selectAllRole } from '@/api/role/searchRole.js'
export default {
  name: 'adminer',
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
    return {
      searchInfo: {
        keyword: '',
        size: 6, // 分页的每一页数目
        indexPageNum: 1 // 当前分页的页码
      },
      // 页面需要渲染的数据:包括当前页面以及制作复用子组件，渲染的数据是需要传递给子组件的。
      showDatas: {
        adminerDatas: [],
        // 定义表格头部数据：一般是固定自己需要的几个字段:所以可以直接在这里定义:也算是定义渲染的模板对象
        adminerAttributs: [
          {
            attributes: 'id',
            name: '管理员编号',
            // 配置每一列的宽度，如果是为了全屏显示的话最后一个不要配置宽度
            width: '250'
          },
          {
            attributes: 'name',
            name: '管理员名称',
            width: '250'
          },
          {
            attributes: 'phone',
            name: '管理员手机号',
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
      dialogFormVisible: false,
      // 表单相关：数据、验证
      formAdminer: {
        id: '',
        name: '',
        password: '',
        phone: '',
        roleId: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入管理员名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入管理员密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        // 没有手机校验规则，所以自定义校验规则
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      formLabelWidth: '120px',
      roles: []
    }
  },
  mounted () {
    // 一开始查询全部--带分页的
    this.searchAllManager()
  },
  methods: {
    searchAllManager () {
      let loading = this.$myLoading('查询中...')
      // 分页信息
      let data = {
        pageNum: this.searchInfo.indexPageNum,
        pageSize: this.searchInfo.size
      }
      managerSelectAll(data).then(res => {
        console.log(res)
        this.datasShow(res)
        loading.close()
      }).catch(err => {
        console.log(err)
        loading.close()
      })
    },
    // 统一表格数据处理：同一个表格实例数据渲染处理：需要判断是否有数据，因为后台没有数据的时候传过来的都是null，此外有数据的时候胡还要判断是否是数组
    datasShow (res) {
      if (res.message === '无数据') {
        this.showDatas.adminerDatas = []
      } else {
        this.showDatas.adminerDatas = []
        if (Array.isArray(res.data)) {
          this.showDatas.adminerDatas = res.data
        } else {
          this.showDatas.adminerDatas.push(res.data)
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
    searchByKeyword () {
      console.log(this.searchInfo.keyword)
      if (this.searchInfo.keyword.replace(/\s*/g, '') === '') {
        this.searchAllManager()
      } else {
        this.searchManagerByPhone()
      }
    },
    searchManagerByPhone () {
      let loading = this.$myLoading('查询中...')
      let data = {
        phone: this.searchInfo.keyword
      }
      managerSelectByPhone(data).then(res => {
        console.log(res)
        this.datasShow(res)
        loading.close()
      }).catch(errs => {
        loading.close()
      })
    },
    searchAllRole () {
      let loading = this.$myLoading('查询中...')
      // 分页信息
      let data = {
        pageNum: 1,
        pageSize: 1000
      }
      selectAllRole(data).then(res => {
        console.log(res)
        this.rolessShow(res)
        loading.close()
      }).catch(err => {
        console.log(err)
        loading.close()
      })
    },
    rolessShow (res) {
      if (res.message === '无数据') {
        this.roles = []
      } else {
        this.roles = []
        if (Array.isArray(res.data)) {
          this.roles = res.data
        } else {
          this.roles.push(res.data)
        }
      }
    },
    // 子组件通过emit触发@xxx事件，函数定义在这里，接受到子组件传递的数据之后写相关业务逻辑
    async operateFun (ind, type) {
      if (type === '编辑') {
        // 查询系统的全部角色信息显示在下拉框
        await this.searchAllRole()
        this.dialogFormVisible = !this.dialogFormVisible
        //! 信息回显到表单:注意表格的一条记录数据从后台获取，但是我们通过字段过滤显示部分数据。但是记录里面是全部的信息，目的是为了
        //! 回显信息到表单。
        let curetnInfo = this.showDatas.adminerDatas[ind]
        for (const key in this.formAdminer) {
          if (this.formAdminer.hasOwnProperty(key)) {
            this.formAdminer[key] = curetnInfo[key]
          }
        }
      } else {
        this.$message({
          message: '暂无权限删除超级管理员',
          type: 'warning'
        })
      }
    },
    // 确认修改管理员信息
    changeInfo () {
      console.log(this.formAdminer)
      let loading = this.$myLoading('修改中...')
      updateUser(this.formAdminer).then(res => {
        console.log(res)
        this.searchByKeyword()
        this.dialogFormVisible = false
        loading.close()
      }).catch(errs => { loading.close() })
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
    }
  }
}
</script>
