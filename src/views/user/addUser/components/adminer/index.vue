<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-07 21:13:53
 -->
<template>
  <div class="adminer">
    <el-form :model="formAdminer" :rules="rules" ref="formAdminer" class="demo-form-inline">
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="管理员名称" prop="name">
            <el-input v-model="formAdminer.name" placeholder="管理员名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理员手机号" prop="phone">
            <el-input v-model="formAdminer.phone" placeholder="管理员手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="管理员密码" prop="password">
            <el-input show-password v-model="formAdminer.password" placeholder="管理员密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="role_id">
            <el-select
              v-model="formAdminer.role_id"
              placeholder="请选择分配给管理员的角色"
              style="width: 100%;"
            >
              <el-option
                v-for="(item,index) in roles"
                :key="index"
                :label="item.name"
                :value="item.role_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
      // 表单相关：数据、验证
      formAdminer: {
        id: '',
        role_id: '',
        name: '',
        password: '',
        phone: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入管理员名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        role_id: [
          {
            required: true,
            message: '请选择租金类型',
            trigger: 'change'
          }
        ],
        password: [
          { required: true, message: '请输入管理员密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        // 没有手机校验规则，所以自定义校验规则
        phone: [{ validator: checkPhone, trigger: 'blur' }]
      },
      // 角色数据
      roles: [
        {
          id: 3001,
          name: '超级管理员'
        },
        {
          id: 3002,
          name: '普通管理员'
        }
      ]
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
    }
  }
}
</script>
