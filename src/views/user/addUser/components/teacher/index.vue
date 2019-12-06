<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-07 17:40:54
 -->
<template>
  <div class="adminer">
    <el-form
      :model="formTeacher"
      :rules="rules"
      ref="formTeacher"
      class="demo-form-inline"
    >
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="教师名称" prop="tecname">
            <el-input v-model="formTeacher.tecname" placeholder="教师名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="教师手机号" prop="phone">
            <el-input v-model="formTeacher.phone" placeholder="教师手机号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="教师邮箱" prop="email">
            <el-input v-model="formTeacher.email" placeholder="教师邮箱"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="教师密码" prop="tecpassword">
            <el-input show-password v-model="formTeacher.tecpassword" placeholder="教师密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="教师年龄" prop="tecage">
            <el-input v-model.number="formTeacher.tecage" placeholder="教师年龄"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="教师性别" prop="tecsex">
            <el-select v-model="formTeacher.tecsex" placeholder="请选择教师性别" style="width: 100%;">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="教师授课类型" prop="tecmajor" >
            <el-input
              v-model="formTeacher.tecmajor"
              placeholder="教师授课类型"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教师地址" prop="address">
            <el-input
              v-model="formTeacher.address"
              placeholder="教师地址"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="教师介绍" prop="tecintroduce">
            <el-input
              type="textarea"
              v-model="formTeacher.tecintroduce"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'teacher',
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
    }
    return {
      // 表单相关：数据、验证
      formTeacher: {
        tecid: '',
        role_id: '', // 角色：教师，默认
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
        tecmajor: [
          { required: true, message: '请输入授课类型', trigger: 'blur' }
        ],
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
    }, 500)
  },
  methods: {
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
    }
  }
}
</script>
