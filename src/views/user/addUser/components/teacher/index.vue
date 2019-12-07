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
          <el-form-item label="教师qq" prop="qq">
            <el-input v-model="formTeacher.qq" placeholder="教师qq"></el-input>
          </el-form-item>
        </el-col>
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
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="教师性别" prop="tecsex">
            <el-select v-model="formTeacher.tecsex" placeholder="请选择教师性别" style="width: 100%;">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="教师授课类型" prop="tecmajor" >
            <el-input
                    v-model="formTeacher.tecmajor"
                    placeholder="教师授课类型"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="教师积分" prop="integral" style="width:100%!important;">
            <el-input  v-model.number="formTeacher.integral" placeholder="教师积分" style="width:240%!important;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="教师地址" prop="address">
            <el-input
              v-model="formTeacher.address"
              placeholder="教师地址"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教师介绍" prop="tecintroduce">
            <el-input
                    type="textarea"
                    v-model="formTeacher.tecintroduce"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="text-align: center;">
        <el-form-item>
          <el-button type="primary" @click="promote('formTeacher')">确 定</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { addTeacher } from '@/api/user/addUser.js'
export default {
  name: 'teacher',
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
      // 表单相关：数据、验证
      formTeacher: {
        // tecid: '',
        tecname: '',
        tecpassword: '',
        tecage: '',
        tecsex: '',
        tecmajor: '',
        phone: '',
        email: '',
        address: '',
        tecintroduce: '',
        integral: '',
        qq: '',
        role: '教师',
        roleId: 2,
        state: 0

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
        tecage: [{ required: true, message: '请输入年龄', trigger: 'blur' }, { validator: inputNum, trigger: 'blur' }],
        // 性别选择:0男1女
        tecsex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        tecmajor: [{ required: true, message: '请输入授课类型', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }],
        // 没有手机校验规则，所以自定义校验规则
        phone: [
          { validator: checkPhone, trigger: 'blur' },
          { required: true, message: '请输入教师手机号', trigger: 'blur' }
        ],
        integral: [{ validator: inputNum, trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'change' }],
        tecintroduce: [
          { required: true, message: '请输入个人简介', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {

  },
  methods: {
    promote (formName) {
      console.log(this.formTeacher)
      this.$refs[formName].validate((valid) => {
        console.log(valid)
        if (valid) {
          console.log(this.formTeacher)
          let loading = this.$myLoading('添加中...')
          addTeacher(this.formTeacher).then(res => {
            loading.close()
            this.reset()
          }).catch(errs => {
            loading.close()
          })
        } else {
          this.$message.error('表单输入内容有误，请检查对应输入框')
          return false
        }
      })
    },
    reset () {
      for (let key in this.formTeacher) {
        if (key !== 'role' && key !== 'roleId' && key !== 'state') {
          this.formTeacher[key] = ''
        }
      }
    }
  }
}
</script>
