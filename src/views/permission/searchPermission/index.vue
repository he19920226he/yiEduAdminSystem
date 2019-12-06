<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-11 08:55:42
 -->
<template>
  <d2-container>
    <template slot="header">权限查询</template>
    <div class="searchPermission">
      <el-row class="d2-mb-10" :gutter="40">
        <el-col :span="8">
          <el-input
            @keyup.enter.native="searchByKeyword"
            placeholder="请输入权限相关信息"
            prefix-icon="el-icon-search"
            v-model="searchInfo.keyword"
          ></el-input>
        </el-col>
      </el-row>
      <el-row class="d2-mb-10">
        <p class="info">权限信息</p>
      </el-row>
      <!-- 封装的本系统的全局表格组件 -->
      <table-page
        :tableDatas="showDatas.permissionDatas"
        :tableHeader="showDatas.permissionAttributs"
        :operateWay="showDatas.operateData"
        :pageInfos="showDatas.pageInfos"
        @operate="operateFun"
        @changePageSize="changeSize"
        @changCurrentePage="changPage"
      />

      <!-- 编辑管理员信息,表单组件类型很多不好像封装表格那样。所以这里就不全局封装了，数据封装一下就行 -->
      <el-dialog title="编辑权限信息" :visible.sync="dialogFormVisible">
        <el-form
          :model="formPermission"
          :rules="rules"
          ref="formPermission"
          class="demo-form-inline"
        >
          <el-row :gutter="25">
            <el-col :span="12">
              <el-form-item label="所属功能模块" prop="parenttitle">
                <el-select
                        v-model="formPermission.parenttitle"
                        placeholder="请选择权限所属功能模块"
                        style="width: 100%;"
                >
                  <el-option
                          v-for="(item,index) in parenttitles"
                          :key="index"
                          :label="item.parenttitle"
                          :value="item.parenttitle"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
<!--            <el-col :span="12">-->
<!--              <el-form-item label="所属功能模块路由" prop="dirName">-->
<!--                <el-input v-model="formPermission.dirName" placeholder="所属功能模块路由"></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
            <el-col :span="12">
              <el-form-item label="权限名称" prop="title">
                <el-input v-model="formPermission.title" placeholder="权限名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="25">

            <el-col :span="12">
              <el-form-item label="权限页面路由" prop="url">
                <el-input v-model="formPermission.url" placeholder="页面路由" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="权限功能模块页面图标" prop="icon">
                <el-input v-model="formPermission.icon" placeholder="权限功能模块页面图标" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="25" style="text-align: right;padding-right: 50px;">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editPermision">确 定</el-button>
          </el-row>

          <el-row :gutter="25">
            <el-col :span="24">
              <ul class="icon-list">
                <li
                        class="icon-item"
                        v-for="(item,index) in menuIcons"
                        :key="index"
                        @click="selectIcon(item)"
                >
                  <i
                          :class="[item.iconBaseClass,item.iconName]"
                          aria-hidden="true"
                          style="font-size:32px;color:#666;"
                  ></i>
                  <span class="icon-name" v-text="item.iconName"></span>
                </li>
              </ul>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import getMenuIcons from '../../../menu/menuIcon'
import util from '@/libs/util.js'
import { LoginAdmin } from '@/api/sys.login.js'
import { selectAll, selectPermisionById } from '@/api/permission/searchPermision'
import { deletePermision } from '@/api/permission/deletePermision.js'
import { updatePermision } from '@/api/permission/updatePermision.js'
export default {
  name: 'searchPermission',
  data () {
    return {
      searchInfo: {
        keyword: '',
        size: 6, // 分页的每一页数目
        indexPageNum: 1 // 当前分页的页码
      },
      // 页面需要渲染的数据:包括当前页面以及制作复用子组件，渲染的数据是需要传递给子组件的。
      showDatas: {
        permissionDatas: [],
        // 定义表格头部数据：一般是固定自己需要的几个字段:所以可以直接在这里定义:也算是定义渲染的模板对象
        permissionAttributs: [
          {
            attributes: 'permissionId',
            name: '权限编码',
            // 配置每一列的宽度，如果是为了全屏显示的话最后一个不要配置宽度
            width: '250'
          },
          {
            attributes: 'title',
            name: '权限名称',
            width: '250'
          },
          {
            attributes: 'parenttitle',
            name: '所属功能模块名称',
            width: '250'
          },
          {
            attributes: 'url',
            name: '权限路由',
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
        //! 只用于显示，根据当前分页的情况：赋值
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
      // TODO:权限所属功能模块列表：这个应该是从后台获取，但是时间不够，暂时写死
      parenttitles: [
        {
          parenttitle: '用户管理'
        },
        {
          parenttitle: '角色管理'
        },
        {
          parenttitle: '权限管理'
        },
        {
          parenttitle: '课程管理'
        },
        {
          parenttitle: '积分管理'
        },
        {
          parenttitle: '评论管理'
        }
      ],
      // 表单相关：数据、验证
      formPermission: {
        permissionId: '',
        parenttitle: '',
        url: '',
        title: '', // 保存选中的权限
        icon: ''
      },
      rules: {
        parenttitle: [
          { required: true, message: '请选择权限名称', trigger: 'change' }
        ],
        url: [
          {
            required: true,
            message: '请输入权限页面路由名称',
            trigger: 'blur'
          },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入权限页面标题', trigger: 'blur' }
        ],
        icon: [{ required: true, message: '请输入页面图标', trigger: 'blur' }]
      },
      menuIcons: []
    }
  },
  mounted () {
    this.menuIcons = getMenuIcons()
    // 开始查询全部--分页查询
    this.searchAllPermision()
  },
  methods: {
    datasShow (res) {
      if (res.message === '无数据') {
        this.showDatas.permissionDatas = []
      } else {
        this.showDatas.permissionDatas = []
        if (Array.isArray(res.data)) {
          this.showDatas.permissionDatas = res.data
        } else {
          this.showDatas.permissionDatas.push(res.data)
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
    searchAllPermision () {
      let loading = this.$myLoading('查询中...')
      // 分页信息
      let data = {
        pageNum: this.searchInfo.indexPageNum,
        pageSize: this.searchInfo.size,
        title: this.searchInfo.keyword
      }
      selectAll(data).then(res => {
        console.log(res)
        this.datasShow(res)
        loading.close()
      }).catch(err => {
        console.log(err)
        loading.close()
      })
    },
    // 根据关键词查询对应的权限
    searchByKeyword () {
      console.log(this.searchInfo.keyword)
      this.searchAllPermision()
    },
    // 子组件通过emit触发@xxx事件，函数定义在这里，接受到子组件传递的数据之后写相关业务逻辑
    operateFun (ind, type) {
      if (type === '编辑') {
        for (let key in this.formPermission) {
          this.formPermission[key] = this.showDatas.permissionDatas[ind][key]
        }
        this.dialogFormVisible = !this.dialogFormVisible
      } else {
        //  删除信息
        this.$confirm('此操作将删除管理员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // 删除权限
            let permissionId = this.showDatas.permissionDatas[ind].permissionId
            console.log(permissionId)
            let data = {
              id: permissionId
            }
            deletePermision(data).then(res => {
              console.log(res)
              this.searchAllPermision()
              // 更新菜单
              this.getNewUserPermision()
            }).catch(errs => {})
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
      this.searchAllPermision()
    },
    /**
     * @description: 改变当前的页码
     * @param {type}
     * @return:
     */
    changPage (currentPage) {
      console.log(`当前页码:${currentPage}`)
      this.searchInfo.indexPageNum = currentPage
      this.searchAllPermision()
    },
    handleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
      //! value就是当前被分配的所有的权限id
    },
    // 选择图标
    selectIcon (item) {
      console.log(item)
      this.formPermission.icon = item.menuIconTitle
    },
    // 编辑权限
    editPermision () {
      let loading = this.$myLoading('修改中...')
      console.log(this.formPermission)
      updatePermision(this.formPermission).then(async res => {
        this.dialogFormVisible = false
        this.searchAllPermision()
        // 权限修改成功了，重新获取用户权限信息以便更新菜单
        this.getNewUserPermision()
        console.log(res)
        loading.close()
      }).catch(err => {
        console.log(err)
        loading.close()
      })
    },
    // todo:这样的话多个涉及到权限更新的地方都需要使用到这个
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
    }
  }
}
</script>
<style lang="css" scoped>
.icon-list {
  overflow: hidden;
  list-style: none;
  padding: 0 !important;
  width: 100%;
}
.icon-list li {
  float: left;
  width: 14%;
  text-align: center;
  height: 101px;
  padding-top: 40px;
  color: #666;
  font-size: 13px;
  border: 1px solid #ddd;
  margin-right: -1px;
  margin-bottom: -1px;
  cursor: pointer;
}
.icon-list li span {
  line-height: normal;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  color: #99a9bf;
  transition: color 0.15s linear;
}
.icon-list li i {
  display: block;
  font-size: 32px;
  margin-bottom: 15px;
  color: #606266;
  transition: color 0.15s linear;
}
.icon-list li .icon-name {
  display: inline-block;
  padding: 0 3px;
  height: 1em;
  transition: color 0.15s linear;
}
.icon-list li:hover i {
  color: #1989fa !important;
}
.icon-list li:hover span {
  color: #1989fa !important;
}
</style>
