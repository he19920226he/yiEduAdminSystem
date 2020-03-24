<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-24 23:33:02
 -->
<template>
  <d2-container>
    <template slot="header">角色查询</template>
    <div class="searchRole">
      <el-row class="d2-mb-10" :gutter="40">
        <el-col :span="8">
          <el-input
            @keyup.enter.native="searchByKeyword"
            placeholder="请输入角色名称"
            prefix-icon="el-icon-search"
            v-model="searchInfo.keyword"
          ></el-input>
        </el-col>
      </el-row>
      <el-row class="d2-mb-10">
        <p class="info">角色信息</p>
      </el-row>
      <!-- 封装的本系统的全局表格组件 -->
      <table-page
        :tableDatas="showDatas.roleDatas"
        :tableHeader="showDatas.roleAttributs"
        :operateWay="showDatas.operateData"
        :pageInfos="showDatas.pageInfos"
        @operate="operateFun"
        @changePageSize="changeSize"
        @changCurrentePage="changPage"
      />

      <!-- 编辑管理员信息,表单组件类型很多不好像封装表格那样。所以这里就不全局封装了，数据封装一下就行 -->
      <el-dialog title="编辑角色信息" :visible.sync="dialogFormVisible">
        <el-form :model="formRole" :rules="rules" ref="formRole" class="demo-form-inline">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="formRole.name" placeholder="角色名称"></el-input>
          </el-form-item>

          <el-form-item label="分配权限" prop="name">
            <el-transfer
              :titles="['未有的权限', '已有权限']"
              v-model="formRole.permisionIds"
              :data="permisionData"
              @change="handleChange"
            ></el-transfer>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSubmission">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import { selectAllRole, selectRoleByName } from '@/api/role/searchRole.js'
import { selectAll } from '@/api/permission/searchPermision'
import { searchPermisionByRole } from '@/api/role-permision/searchPermisionByRole.js'
import { addPermisionRole } from '@/api/role-permision/addPermisionRole.js'
import { deleteRolePermison } from '@/api/role-permision/deleteRolePermison.js'
import { updateRole } from '@/api/role/updateRole.js'
import { deleteRole } from '@/api/role/deleteRole.js'
import { LoginAdmin } from '@/api/sys.login.js'
import util from '@/libs/util.js'
export default {
  name: 'searchRole',
  data () {
    return {
      searchInfo: {
        keyword: '',
        size: 6, // 分页的每一页数目
        indexPageNum: 1 // 当前分页的页码
      },
      // 页面需要渲染的数据:包括当前页面以及制作复用子组件，渲染的数据是需要传递给子组件的。
      showDatas: {
        roleDatas: [],
        // 定义表格头部数据：一般是固定自己需要的几个字段:所以可以直接在这里定义:也算是定义渲染的模板对象
        roleAttributs: [
          {
            attributes: 'roleId',
            name: '角色编号',
            // 配置每一列的宽度，如果是为了全屏显示的话最后一个不要配置宽度
            width: '250'
          },
          {
            attributes: 'name',
            name: '角色名称',
            width: '250'
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
      formRole: {
        roleId: '',
        name: '',
        permisionIds: [], // 保存分配的权限
        rolePermisionIds: []
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      permisions: [], // 系统全部的权限信息
      permisionData: [] // 权限信息用于显示在穿梭框
    }
  },
  mounted () {
    this.searchAllRole()
    // todo:
    // setTimeout(() => {
    //   loading.close()
    //   for (let i = 0; i < 4; i++) {
    //     this.data.push({
    //       key: i,
    //       label: `权限 ${i}`,
    //       disabled: false
    //     })
    //   }
    //   this.showDatas.roleDatas.push({
    //     id: '4001',
    //     name: '超级管理员'
    //   })
    //   this.showDatas.roleDatas.push({
    //     id: '4002',
    //     name: '普通管理员'
    //   })
    //   this.showDatas.roleDatas.push({
    //     id: '4003',
    //     name: '教师'
    //   })
    //   this.showDatas.pageInfos.totalPage = 3
    //   this.showDatas.pageInfos.isShowPage = true
    // }, 500)
  },
  methods: {

    // 统一表格数据处理：同一个表格实例数据渲染处理：需要判断是否有数据，因为后台没有数据的时候传过来的都是null，此外有数据的时候胡还要判断是否是数组
    datasShow (res) {
      if (res.message === '无数据') {
        this.showDatas.roleDatas = []
      } else {
        this.showDatas.roleDatas = []
        if (Array.isArray(res.data)) {
          this.showDatas.roleDatas = res.data
        } else {
          this.showDatas.roleDatas.push(res.data)
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
    searchAllRole () {
      let loading = this.$myLoading('查询中...')
      // 分页信息
      let data = {
        pageNum: this.searchInfo.indexPageNum,
        pageSize: this.searchInfo.size
      }
      selectAllRole(data).then(res => {
        console.log(res)
        this.datasShow(res)
        loading.close()
      }).catch(err => {
        console.log(err)
        loading.close()
      })
    },
    // 获取系统全部的权限
    getAllPermision () {
      // 分页信息
      let data = {
        pageNum: 1,
        pageSize: 1000
      }
      selectAll(data).then(res => {
        console.log(res)
        this.permisionData = []
        this.permisions = []
        if (res.message !== '无数据') {
          if (Array.isArray(res.data)) {
            for (let i = 0; i < res.data.length; i++) {
              this.permisions.push(res.data[i])
              let obj = {
                key: res.data[i].permissionId,
                label: res.data[i].title
              }
              this.permisionData.push(obj)
            }
          } else {
            this.permisions.push(res.data)
            this.permisionData.push({
              key: res.data.permissionId,
              label: res.data.title
            })
          }
        }
        console.log(this.permisionData)
        // 根据角色id判断在这里权限中该角色是被分配是了多少
        // this.searchRolePermision(this.formRole.roleId)
        // 根据角色id获取当前角色被分配的权限
        this.searchRolePermision(this.formRole.roleId)
      }).catch(err => {
        console.log(err)
      })
    },
    // 根据角色名称查询
    searchByKeyword () {
      console.log(this.searchInfo.keyword) // str.replace(/\s*/g,"")
      if (this.searchInfo.keyword.replace(/\s*/g, '') === '') {
        this.searchAllRole()
        return
      }
      let loading = this.$myLoading('查询当中...')
      let data = {
        keyword: this.searchInfo.keyword
      }
      selectRoleByName(data).then(res => {
        console.log(res)
        this.datasShow(res)
        loading.close()
      }).catch(errs => {
        console.log(errs)
      })
    },
    // 子组件通过emit触发@xxx事件，函数定义在这里，接受到子组件传递的数据之后写相关业务逻辑
    operateFun (ind, type) {
      if (type === '编辑') {
        // 基本信息回显还有查看该角色拥有的权限
        this.dialogFormVisible = !this.dialogFormVisible
        //! 信息回显到表单:注意表格的一条记录数据从后台获取，但是我们通过字段过滤显示部分数据。但是记录里面是全部的信息，目的是为了
        //! 回显信息到表单。
        let curetnInfo = this.showDatas.roleDatas[ind]
        for (const key in this.formRole) {
          if (this.formRole.hasOwnProperty(key) && key !== 'permisionIds') {
            this.formRole[key] = curetnInfo[key]
          }
        }
        // 获取当前的权限信息，还有根据当前角色id获取已经被分配的权限
        this.getAllPermision()
      } else {
        //  删除信息
        this.$confirm('此操作将删除此角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let loading = this.$myLoading('删除中...')
            // 删除管理员
            let rId = this.showDatas.roleDatas[ind].roleId
            console.log(rId)
            let data = {
              id: rId
            }
            deleteRole(data).then(res => {
              console.log(res)
              loading.close()
              this.searchAllRole()
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
      }
    },
    // 根据角色id判断当前角色拥有哪些权限
    searchRolePermision (roleId) {
      this.formRole.permisionIds = []
      this.formRole.rolePermisionIds = []
      // for (let i = 0; i < this.permisions.length; i++) {
      //   if (this.permisions[i].roleandpermission >= roleId) {
      //     console.log(this.permisions[i].roleandpermission)
      //     this.formRole.permisionIds.push(this.permisions[i].permissionId)
      //   }
      // }
      let data = {
        pageNum: 1,
        pageSize: 1000,
        roleId: roleId
      }
      searchPermisionByRole(data).then(res => {
        console.log(res)
        if (res.data == null) {
          return
        }
        for (let i = 0; i < res.data.length; i++) {
          this.formRole.permisionIds.push(res.data[i].permissionId)
          this.formRole.rolePermisionIds[res.data[i].permissionId] = res.data[i].rolePermissionId
        }
      }).catch(errs => {})
    },
    /**
     * @description:改变每页显示的条数，重新发送请求。
     * @param {type}
     * @return:
     */
    changeSize (size) {
      console.log(`每页 ${size} 条`)
      this.searchInfo.size = size
      this.searchAllRole()
    },
    /**
     * @description: 改变当前的页码
     * @param {type}
     * @return:
     */
    changPage (currentPage) {
      console.log(`当前页码:${currentPage}`)
      this.searchInfo.indexPageNum = currentPage
      this.searchAllRole()
    },
    // 监听穿梭框左右列表数据的变化，以便调用接口进行权限的分配与取消
    handleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
      // direction判断是分配还是取消权限，moveKeys保存了需要操作的权限
      for (let i = 0; i < movedKeys.length; i++) {
        this.changeRolePermisions(direction, movedKeys[i])
      }
      // 延迟判断是否是当前用户的角色重新更新菜单
      setTimeout(() => {
        // 用户id
        let roleid = util.cookies.get('roleid')
        console.log(roleid, this.formRole.roleId)
        if (+roleid === this.formRole.roleId) {
          // 重新查询选择更新菜单
          this.getNewUserPermision()
        }
      }, 1000)
    },
    getNewUserPermision () {
      let data = {
        name: util.cookies.get('usaccount'),
        password: util.cookies.get('uspassword')
      }
      LoginAdmin(data).then(async res => {
        console.log((res))
        let userMenu = util.menuFormate(res.data.list)
        console.log(userMenu)
        userMenu = JSON.stringify(userMenu)
        // 持久化用户菜单
        const db = await this.$store.dispatch('d2admin/db/database')
        db.set('menus', userMenu).write()
        //  更新菜单
        this.$store.commit('d2admin/menu/asideSet', JSON.parse(userMenu))
      }).catch(err => {
        console.log(err)
      })
    },
    changeRolePermisions (type, id) {
      let data
      if (type === 'right') {
        // 分配权限
        data = {
          'permissionId': id,
          'roleId': this.formRole.roleId
        }
        addPermisionRole(data).then(res => {
          console.log(res)
        }).catch(errs => {})
      } else if (type === 'left') {
        // 取消权限
        data = {
          'id': this.formRole.rolePermisionIds[id]
        }
        deleteRolePermison(data).then(res => {

        }).catch(errs => {})
      }
    },
    // 确认修改
    editSubmission () {
      // todo:如果是点击确定好修改分配权限的话就在这里重新设置侧边栏菜单:动态设置侧边栏菜单api

      // 这里确定修改不包括分配权限的，这是修改角色的基本信息
      let data = {
        'name': this.formRole.name,
        'roleId': this.formRole.roleId
      }
      console.log(data)
      updateRole(data).then(res => {
        console.log(res)
        this.searchAllRole()
        this.dialogFormVisible = false
      }).catch(errs => {

      })

      // let menusDatas = JSON.stringify(mockMenudatas)
      //       const db = await this.$store.dispatch('d2admin/db/database')
      //       db.set('menus', menusDatas).write()
      //       // 更新菜单
      //       this.$store.commit('d2admin/menu/asideSet', mockMenudatas)
    }
  }
}
</script>
