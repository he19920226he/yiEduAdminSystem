<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-12-04 10:42:44
 -->
<template>
  <d2-container>
    <template slot="header">课程类别管理</template>
    <div class="VaryManager">
      <el-row class="d2-mb-10" :gutter="40">
        <el-col :span="8">
        <el-input
            @keyup.enter.native="searchByKeyword"
            placeholder="请输入分类名称"
            prefix-icon="el-icon-search"
            v-model="searchInfo.keyword"
          ></el-input>
        </el-col>
        <el-col :span="6">
            <el-button type="primary"><span class="el-icon-circle-plus"></span> 添加</el-button>
        </el-col>
      </el-row>
      <el-row class="d2-mb-10">
        <p class="info">课程类别信息</p>
      </el-row>
      <!-- 封装的本系统的全局表格组件 -->
      <table-page
        :tableDatas="showDatas.prizeDatas"
        :tableHeader="showDatas.prizeAttributs"
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
                <el-input v-model="formPermission.parenttitle" placeholder="所属功能模块"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属功能模块路由" prop="parenName">
                <el-input v-model="formPermission.parenName" placeholder="所属功能模块路由"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="25">
            <el-col :span="12">
              <el-form-item label="权限名称" prop="name">
                <el-input v-model="formPermission.name" placeholder="权限名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="权限页面路由" prop="parenttitle">
                <el-input v-model="formPermission.url" placeholder="页面路由"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="25">
            <el-col :span="12">
              <el-form-item label="权限页面标题" prop="title">
                <el-input v-model="formPermission.title" placeholder="权限页面标题"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="权限功能模块页面图标" prop="icon">
                <el-input v-model="formPermission.icon" placeholder="权限功能模块页面图标" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
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
export default {
  name: 'VaryManager',
  data () {
    return {
      searchInfo: {
        keyword: '',
        size: '', // 分页的每一页数目
        indexPageNum: '' // 当前分页的页码
      },
      // 页面需要渲染的数据:包括当前页面以及制作复用子组件，渲染的数据是需要传递给子组件的。
      showDatas: {
        prizeDatas: [],
        // 定义表格头部数据：一般是固定自己需要的几个字段:所以可以直接在这里定义:也算是定义渲染的模板对象
        prizeAttributs: [
          {
            attributes: 'prize_id',
            name: '物品编码',
            // 配置每一列的宽度，如果是为了全屏显示的话最后一个不要配置宽度
            width: '250'
          },
          {
            attributes: 'pname',
            name: '物品名称',
            width: '250'
          },
          {
            attributes: 'integral',
            name: '所需积分额度',
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
          pageSize: [], // 定义可以调整每一页显示数目
          isShowPage: false // false：不显示分页控件
        },
        loadinInfo: {
          isLoading: false,
          info: '确定修改'
        }
      },
      dialogFormVisible: false,
      // 表单相关：数据、验证
      formPermission: {
        permission_id: '',
        parentName: '',
        url: '',
        name: '',
        title: '', // 保存选中的权限
        icon: '',
        parenttitle: ''
      },
      rules: {
        parentName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
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
        icon: [{ required: true, message: '请输入页面图标', trigger: 'blur' }],
        parenttitle: [
          { required: true, message: '请输入页面图标', trigger: 'blur' }
        ]
      },
      menuIcons: []
    }
  },
  mounted () {
    let loading = this.$myLoading('切换中')
    setTimeout(() => {
      loading.close()
      this.menuIcons = getMenuIcons()
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
        let curetnInfo = this.showDatas.roleDatas[ind]
        console.log(curetnInfo['id'])
        for (const key in this.formRole) {
          if (this.formRole.hasOwnProperty(key) && key !== 'permisionIds') {
            this.formRole[key] = curetnInfo[key]
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
    },
    handleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
      //! value就是当前被分配的所有的权限id
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
