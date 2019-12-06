<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-09 20:34:30
 -->
<template>
  <d2-container>
    <template slot="header">添加权限</template>
    <div class="addPermission">
      <el-form :model="formPermission" :rules="rules" ref="formPermission" class="demo-form-inline">
        <el-row :gutter="50">
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
          <el-col :span="12">
            <el-form-item label="权限所属于模块路由名称" prop="dirName">
              <el-select
                      v-model="formPermission.dirName"
                      placeholder="权限所属于模块路由名称"
                      style="width: 100%;"
              >
                <el-option
                        v-for="(item,index) in dirNames"
                        :key="index"
                        :label="item.dirName"
                        :value="item.dirName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="权限页面标题" prop="title">
              <el-input v-model="formPermission.title" placeholder="权限页面标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限页面路由" prop="url">
              <el-input v-model="formPermission.url" placeholder="权限页面路由"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="页面图标" prop="icon">
<!--  使用带建议的输入框，  -->
              <el-autocomplete
                      style="width: 100%"
                      v-model="formPermission.icon"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入图标或者是从下面图标选择"
                      :trigger-on-focus="false"
                      @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="25" style="text-align: center;padding-right: 50px;">

          <el-button type="primary" @click="add">确 定</el-button>
          <el-button @click="reset">重置</el-button>

        </el-row>
        <!-- 图标选中宫格列表 -->
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
    </div>
  </d2-container>
</template>

<script>
import getMenuIcons from '../../../menu/menuIcon'
import util from '@/libs/util.js'
import { LoginAdmin } from '@/api/sys.login.js'
import { addPermision } from '@/api/permission/addPermision.js'
export default {
  name: 'addPermission',
  data () {
    return {
      // 表单相关：数据、验证
      formPermission: {
        dirName: '', // 父级的路由名称：比如用户管理是user
        parenttitle: '',
        title: '',
        url: '',
        icon: '',
        roleandpermission: 1
      },
      rules: {
        dirName: [
          { required: true, message: '请选择权限所属功能模块', trigger: 'change' }
        ],
        parenttitle: [
          { required: true, message: '请选择权限所属功能模块', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入权限页面标题', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入页面路由地址', trigger: 'blur' }
        ]
        // icon: [{ required: true, message: '请输入页面图标', trigger: 'blur' }]
      },
      menuIcons: [],
      menuIcontext: [],
      // TODO:权限所属功能模块列表：这个应该是从后台获取，但是时间不够，暂时写死,，而且这里与前端添加路由页面是有关系的
      // 有多少个功能模块对应有多少个前端要添加多少个路由页面文件，显然为了不出问题，像这些模块还有路由名称都由前端管理后添加到后台
      // 比如现在这个版本就那么多个功能模块这些就暂时写死在后。。。
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
      dirNames: [
        {
          dirName: 'user'
        },
        {
          dirName: 'role'
        },
        {
          dirName: 'permission'
        },
        {
          dirName: 'course'
        },
        {
          dirName: 'integral'
        },
        {
          dirName: 'comment'
        }

      ]
    }
  },
  mounted () {
    // 获取图标数据
    this.menuIcons = getMenuIcons()
    this.menuIcontext = this.loadAll()
  },
  methods: {
    querySearch (queryString, cb) {
      var menuIcontext = this.menuIcontext
      var results = queryString ? menuIcontext.filter(this.createFilter(queryString)) : menuIcontext
      // 调用 callback 返回建议列表的数据
      cb(results)
      console.log(results)
    },
    createFilter (queryString) {
      return (menuIcon) => {
        return (menuIcon.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll () {
      let datas = []
      for (let i = 0; i < this.menuIcons.length; i++) {
        datas.push({
          value: this.menuIcons[i].menuIconTitle,
          address: this.menuIcons[i].iconName
        })
      }
      return datas
    },
    handleSelect (item) {
      console.log(item)
    },
    handleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
      //! value就是当前被分配的所有的权限id
    },
    // 选择图标
    selectIcon (icon) {
      console.log(icon)
      this.formPermission.icon = icon.menuIconTitle
    },
    reset () {
      for (let key in this.formPermission) {
        this.formPermission[key] = ''
      }
    },
    add () {
      let loading = this.$myLoading('正在添加当中...')
      console.log(this.formPermission)
      addPermision(this.formPermission).then(res => {
        console.log(res)
        loading.close()
        this.getNewUserPermision()
      }).catch(errs => {
        console.log(errs)
        loading.close()
      })
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
        this.reset()
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
  border: 1px solid #ddd;
  border-radius: 4px;
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
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
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
