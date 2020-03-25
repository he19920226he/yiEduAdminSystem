<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-25 14:15:20
 -->
<template>
    <div class="user">
        <el-form
                :model="formUser"
                :rules="rules"
                ref="formUser"
                class="demo-form-inline"
        >
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="用户名称" prop="stuname">
                        <el-input v-model="formUser.stuname" placeholder="用户名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用户昵称" prop="petname">
                        <el-input v-model="formUser.petname" placeholder="宠物名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用户手机号" prop="phone">
                        <el-input v-model="formUser.phone" placeholder="用户手机号"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="用户邮箱" prop="email">
                        <el-input v-model="formUser.email" placeholder="用户邮箱"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用户qq" prop="qq">
                        <el-input v-model="formUser.qq" placeholder="用户qq"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用户密码" prop="stupassword">
                        <el-input show-password v-model="formUser.stupassword" placeholder="用户密码"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="用户年龄" prop="stuage">
                        <el-input  v-model.number="formUser.stuage" placeholder="用户年龄"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                <el-form-item label="用户性别" prop="stusex">
                    <el-select v-model="formUser.stusex" placeholder="请选择用户性别" style="width: 100%!important;">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
                <el-col :span="8">
                    <el-form-item label="用户地址" prop="address" style="width:100%!important;">
                        <el-input  v-model="formUser.address" placeholder="教师地址" style="width:255%!important;"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-form-item label="用户自我介绍" prop="stuintroduce" style="width:100%!important;">
                        <el-input type="textarea" v-model="formUser.stuintroduce" style="width:270%!important;"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="text-align: center;">
                <el-form-item>
                    <el-button type="primary" @click="promote('formUser')">确 定</el-button>
                    <el-button @click="reset">重置</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import { addStudent } from '@/api/user/addUser.js'
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
      var reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (!reg.test(value)) {
        callback(new Error('邮箱格式不对'))
      } else {
        callback()
      }
    }
    return {
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
        qq: '',
        role: '学生',
        roleId: 3,
        'state': 0
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

  },
  methods: {
    promote (formName) {
      console.log(this.formUser)
      this.$refs[formName].validate((valid) => {
        console.log(valid)
        if (valid) {
          let loading = this.$myLoading('添加中...')
          addStudent(this.formUser).then(res => {
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
      for (let key in this.formUser) {
        if (key !== 'role' && key !== 'roleId' && key !== 'state') {
          this.formUser[key] = ''
        }
      }
    }
  }
}
</script>
