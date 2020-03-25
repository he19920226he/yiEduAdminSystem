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
      </el-row>
      <el-row style="text-align: center;">
        <el-button type="primary" @click="cconfirm('formAdminer')">确 定</el-button>
        <el-button @click="reset">重置</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { addManager } from '@/api/user/addUser.js'
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
      // 表单相关：数据、验证
      formAdminer: {
        name: '',
        password: '',
        phone: '',
        roleId: 1
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
        phone: [{ validator: checkPhone, trigger: 'blur' }]
      }
    }
  },
  mounted () {

  },
  methods: {
    reset () {
      for (let key in this.formAdminer) {
        if (key !== 'roleId') {
          this.formAdminer[key] = ''
        }
      }
    },
    cconfirm (formName) {
      console.log(this.formAdminer)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let loading = this.$myLoading('修改中...')
          addManager(this.formAdminer).then(res => {
            loading.close()
            console.log(res)
          }).catch(errs => {
            loading.close()
          })
        } else {
          this.$message.error('表单内容有误，请检查对应输入框')
          return false
        }
      })
    }

  }
}
</script>
