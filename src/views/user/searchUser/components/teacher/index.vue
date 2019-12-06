<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-07 15:55:25
 -->
<template>
  <div class="adminer">
    <el-row class="d2-mb-10" :gutter="20">
      <el-col :span="8">
        <el-input
          @keyup.enter.native="searchByKeyword"
          placeholder="请输入教师相关信息"
          prefix-icon="el-icon-search"
          v-model="searchInfo.keyword"
        ></el-input>
      </el-col>
    </el-row>
    <el-row class="d2-mb-10">
      <p class="info">教师信息</p>
    </el-row>
    <!-- 封装的本系统的全局表格组件 -->
    <table-page
      :tableDatas="showDatas.teacherDatas"
      :tableHeader="showDatas.teacherAttributs"
      :operateWay="showDatas.operateData"
      :pageInfos="showDatas.pageInfos"
      @operate="operateFun"
      @changePageSize="changeSize"
      @changCurrentePage="changPage"
    />
    <!-- 编辑教师信息,表单组件类型很多不好像封装表格那样。所以这里就不全局封装了，数据封装一下就行 -->
    <el-dialog title="编辑教师信息" :visible.sync="dialogFormVisible">
      <el-form
        :inline="true"
        :model="formTeacher"
        :rules="rules"
        ref="formTeacher"
        class="demo-form-inline"
      >
        <el-form-item label="教师名称" prop="tecname">
          <el-input v-model="formTeacher.tecname" placeholder="教师名称"></el-input>
        </el-form-item>
        <el-form-item label="教师手机号" prop="phone">
          <el-input v-model="formTeacher.phone" placeholder="教师手机号"></el-input>
        </el-form-item>
        <el-form-item label="教师邮箱" prop="email">
          <el-input v-model="formTeacher.email" placeholder="教师邮箱"></el-input>
        </el-form-item>
        <el-form-item label="教师密码" prop="tecpassword">
          <el-input show-password v-model="formTeacher.tecpassword" placeholder="教师密码"></el-input>
        </el-form-item>
        <el-form-item label="教师年龄" prop="tecage">
          <el-input  v-model.number="formTeacher.tecage" placeholder="教师年龄"></el-input>
        </el-form-item>
        <el-form-item label="教师性别" prop="tecsex">
          <el-select v-model="formTeacher.tecsex" placeholder="请选择教师性别">
            <el-option label="男" value="0"></el-option>
            <el-option label="女" value="1"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="教师授课类型" prop="tecmajor" style="width:100%!important;">
          <el-input  v-model="formTeacher.tecmajor" placeholder="教师授课类型" style="width:240%!important;"></el-input>
        </el-form-item>
        <el-form-item label="教师地址" prop="address" style="width:100%!important;">
          <el-input  v-model="formTeacher.address" placeholder="教师地址" style="width:255%!important;"></el-input>
        </el-form-item>
        <el-form-item label="教师介绍" prop="tecintroduce" style="width:100%!important;">
          <el-input type="textarea" v-model="formTeacher.tecintroduce" style="width:270%!important;"></el-input>
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
        teacherDatas: [],
        // 定义表格头部数据：一般是固定自己需要的几个字段:所以可以直接在这里定义:也算是定义渲染的模板对象
        teacherAttributs: [
          {
            attributes: 'tecid',
            name: '教师编号',
            // 配置每一列的宽度，如果是为了全屏显示的话最后一个不要配置宽度
            width: '130'
          },
          {
            attributes: 'tecname',
            name: '教师名称',
            width: '130'
          },
          {
            attributes: 'tecage',
            name: '教师年龄',
            width: '130'
          },
          {
            attributes: 'tecsex',
            name: '教师性别',
            width: '130'
          },
          {
            attributes: 'tecmajor',
            name: '教学类型',
            width: '130'
          },
          {
            attributes: 'phone',
            name: '手机号',
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
      formTeacher: {
        tecid: '',
        tecname: '',
        tecpassword: '',
        tecage: '',
        tecsex: '',
        tecmajor: '',
        phone: '',
        email: '',
        address: '',
        tecintroduce: ''
      },
      rules: {
        tecname: [
          { required: true, message: '请输入教师名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        tecpassword: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        // 性别选择:0男1女
        tecage: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        // 性别选择:0男1女
        tecsex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        tecmajor: [{ required: true, message: '请输入授课类型', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'change' }],
        // 没有手机校验规则，所以自定义校验规则
        phone: [
          { validator: checkPhone, trigger: 'blur' },
          { required: true, message: '请输入教师手机号', trigger: 'blur' }
        ],
        address: [{ required: true, message: '请输入地址', trigger: 'change' }],
        tecintroduce: [
          { required: true, message: '请输入个人简介', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    let loading = this.$myLoading('切换中')
    setTimeout(() => {
      loading.close()
      this.showDatas.teacherDatas.push({
        tecid: '1001',
        tecname: '李老师',
        tecpassword: '123456',
        tecage: '23',
        tecsex: '男',
        tecmajor: '区块链',
        phone: '1230003000',
        email: '1145347844@qq.com',
        address: '广东省广州市嘉禾望岗',
        tecintroduce: 'xxx大公司的区块链技术负责人'
      })
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
        let curetnInfo = this.showDatas.teacherDatas[ind]
        for (const key in this.formTeacher) {
          if (this.formTeacher.hasOwnProperty(key)) {
            this.formTeacher[key] = curetnInfo[key]
          }
        }
      } else {
        //  删除信息
        console.log(this.showDatas.teacherDatas[ind].tecid)
        this.$confirm('此操作将删除管理员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {})
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
