<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-07 21:23:40
 -->
<template>
  <d2-container>
    <template slot="header">添加角色</template>
    <div class="addRole">
      <el-form :model="formRole" :rules="rules" ref="formRole" class="demo-form-inline">
        <el-row :gutter="50">
          <el-col :span="12" :offset="6">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="formRole.name" placeholder="角色名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <h4 style="margin-left:10px!important;">给角色分配权限</h4>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="6">
            <el-transfer
              :titles="['未有的权限', '已有权限']"
              v-model="formRole.permisionIds"
              :data="permisionData"
              @change="handleChange"
            ></el-transfer>
          </el-col>
        </el-row>
        <el-row style="text-align: center;padding-right: 50px;margin-top: 15px;">

          <el-button type="primary" @click="add">确 定</el-button>
          <el-button @click="reset">重置</el-button>

        </el-row>
      </el-form>
    </div>
  </d2-container>
</template>
import { addRole } from '@/api/role/addRole.js'
<script>
import { addRole } from '../../../api/role/addRole'
import { selectAll } from '@/api/permission/searchPermision'
import { addPermisionRole } from '@/api/role-permision/addPermisionRole.js'

export default {
  name: 'addRole',
  data () {
    return {
      // 表单相关：数据、验证
      formRole: {
        name: '',
        permisionIds: [] // 绑定选中的权限id
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      permisionData: [], // 权限信息
      roleId: ''
    }
  },
  mounted () {
    this.getAllPermision()
  },
  methods: {
    handleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
      //! value就是当前被分配的所有的权限id
    },
    reset () {
      this.formRole.name = ''
      this.formRole.permisionIds = []
    },
    add () {
      let data = {
        name: this.formRole.name
      }
      console.log(this.formRole)
      let loading = this.$myLoading('添加中...')
      addRole(data).then(res => {
        console.log(res)
        this.roleId = res.data
        loading.close()
        // 判断是否还需要分配权限
        this.givePermision()
      }).catch(errs => {
        console.log(errs)
        loading.close()
      })
    },
    givePermision () {
      if (this.formRole.permisionIds.length !== 0) {
        for (var i = 0; i < this.formRole.permisionIds.length; i++) {
          // 分配权限
          let data = {
            'permissionId': this.formRole.permisionIds[i],
            'roleId': this.roleId
          }
          addPermisionRole(data).then(res => {
            console.log(res)
          }).catch(errs => {})
        }
      }
    },
    // 分配权限相关：
    // 获取系统全部的权限
    getAllPermision () {
      let loading = this.$myLoading('获取权限中...')
      // 分页信息
      let data = {
        pageNum: 1,
        pageSize: 1000
      }
      selectAll(data).then(res => {
        console.log(res)
        loading.close()
        this.permisionData = []
        if (res.message !== '无数据') {
          if (Array.isArray(res.data)) {
            for (let i = 0; i < res.data.length; i++) {
              let obj = {
                key: res.data[i].permissionId,
                label: res.data[i].title
              }
              this.permisionData.push(obj)
            }
          } else {
            this.permisionData.push({
              key: res.data.permissionId,
              label: res.data.title
            })
          }
        }
        console.log(this.permisionData)
      }).catch(err => {
        console.log(err)
        loading.close()
      })
    }
  }
}
</script>
