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
          placeholder="请输入管理员相关信息"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'adminer',
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
    }
    return {
      searchInfo: {
        keyword: '',
        size: '', // 分页的每一页数目
        indexPageNum: '' // 当前分页的页码
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
        phone: ''
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
        ]
      },
      formLabelWidth: '120px'
    }
  },
  mounted () {
    let loading = this.$myLoading('切换中')
    setTimeout(() => {
      loading.close()
      this.showDatas.adminerDatas.push({
        id: '0001',
        name: '超级管理员',
        phone: '1001010010',
        password: '123456'
      })
      this.showDatas.adminerDatas.push({
        id: '0002',
        name: '普通管理员1',
        phone: '1001990010',
        password: '123456'
      })
      this.showDatas.adminerDatas.push({
        id: '0003',
        name: '普通管理员2',
        phone: '1001990023',
        password: '123456'
      })
      this.showDatas.pageInfos.totalPage = 3
      this.showDatas.pageInfos.isShowPage = true
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
        let curetnInfo = this.showDatas.adminerDatas[ind]
        for (const key in this.formAdminer) {
          if (this.formAdminer.hasOwnProperty(key)) {
            this.formAdminer[key] = curetnInfo[key]
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
    }
  }
}
</script>
