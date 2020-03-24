<template>
  <d2-container>
    <template slot="header">分类查询</template>
  <div class="VaryManager">
    <div class="main-body">

      <el-row class="d2-mb-10" :gutter="40">
        <el-col :span="6">
          <el-input
                  placeholder="请输入分类名称"
                  prefix-icon="el-icon-search"
                  v-model="searchInfo.varyName"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-select placeholder="请选择级别"  v-model="selectVal" style="width:100%!important;" @change="changeLevel()">
            <el-option label="一级类别" :value="2"></el-option>
            <el-option label="二级类别" :value="3"></el-option>
             <el-option label="三级类别" :value="4"></el-option>
          </el-select>
        </el-col>
<!--        <el-col :span="6" style="text-align: left;padding-left: -50px!important;">-->
<!--          <el-button type="primary" icon="el-icon-search" size="small" @click="searchTeachers">查询</el-button>-->
<!--          <el-button  icon="el-icon-refresh" size="small" @click="reset">重置</el-button>-->
<!--        </el-col>-->
      </el-row>

      <el-row style="margin-top: 30px;">
        <el-col :span="20" :offset="2">
          <el-tree
                  :data="data"
                  node-key="id"
                  default-expand-all
                  @node-drag-start="handleDragStart"
                  @node-drag-enter="handleDragEnter"
                  @node-drag-leave="handleDragLeave"
                  @node-drag-over="handleDragOver"
                  @node-drag-end="handleDragEnd"
                  @node-drop="handleDrop"
                  draggable
                  :allow-drop="allowDrop"
                  :allow-drag="allowDrag"
                  :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span class="operate">
          <i class="el-icon-edit" @click="() => edit(data)"></i>

           <i style="display: inline-block; margin-left: 10px;" class="el-icon-delete"  @click="() => remove(node, data)"></i>
        </span>
      </span>
          </el-tree>
        </el-col>

      </el-row>

    </div>

    <!-- 编辑类别信息 -->
    <el-dialog title="编辑类别信息" :visible.sync="dialogFormVisible">
      <el-form :model="varyForm" :rules="rules" ref="varyForm" class="demo-form-inline">
        <el-form-item label="类别名称" prop="varyName">
          <el-input v-model="varyForm.varyName" placeholder="分裂名称"></el-input>
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

import { selectAllVary } from '@/api/course-vary/selectAll.js'
import { getHigherLevel } from '@/api/course-vary/getHigherLevel.js'
import { updateVary } from '@/api/course-vary/updateVary.js'
import { deleteVary } from '@/api/course-vary/deleteVary.js'
export default {
  name: 'VaryManager',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入类别名称'))
      } else {
        callback()
      }
    }

    return {
      dialogFormVisible: false,
      selectVal: '',
      searchInfo: {
        varyName: '',
        size: 6, // 分页的每一页数目
        indexPageNum: 1, // 当前分页的页码
        vary: ''
      },
      currentContentNName: '查询机构', // 通过路由传参数实现
      searchVal: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isSelect: true,
      varyForm: {
        // element-ui自定义表单验证的输入框的name属性
        varyName: '',
        id: ''
      },
      rules: {
        varyName: [{ validator: validatePass, trigger: 'blur' }]
      },
      varyDatas: []// 修改需要
    }
  },

  mounted () {
    this.searchVarys()
  },

  methods: {
    searchVarys () {
      let loading = this.$myLoading('查询中...')
      selectAllVary().then(res => {
        // 构建类别数据的树状结构
        this.dataTree(res)
        loading.close()
      }).catch(errs => {})
    },
    dataTree (res) {
      console.log(res)
      let data = []
      this.varyDatas = res.data
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].level === 1) {
          let json = {
            label: res.data[i].kindName,
            id: res.data[i].kid,
            level: 1,
            children: []
          }
          data.push(json)
        }
      }

      for (let i = 0; i < res.data.length; i++) {
        if ((res.data[i].level === 2)) {
          for (let j = 0; j < data.length; j++) {
            if (data[j].id === res.data[i].higherId) {
              data[j].children.push({
                label: res.data[i].kindName,
                id: res.data[i].kid,
                level: 2,
                children: []
              })
            }
          }
        }
      }
      for (let i = 0; i < res.data.length; i++) {
        if ((res.data[i].level === 3)) {
          for (let j = 0; j < data.length; j++) {
            for (let k = 0; k < data[j].children.length; k++) {
              if (data[j].children[k].id === res.data[i].higherId) {
                data[j].children[k].children.push({
                  label: res.data[i].kindName,
                  id: res.data[i].kid,
                  level: 2,
                  children: []
                })
              }
            }
          }
        }
      }
      console.log(data)
      this.data = data
    },
    changeLevel () {
      console.log(this.selectVal)
      getHigherLevel(this.selectVal).then((result) => {
        console.log(result)
        let data = []
        for (let i = 0; i < result.data.length; i++) {
          const element = result.data[i]
          let json = {
            label: element.kindName,
            id: element.kid,
            level: element.level,
            children: []
          }
          data.push(json)
        }
        this.data = data
      }).catch((err) => {
        console.log(err)
      })
    },

    // 树节点拖拽，修改对应的级别需要
    handleDragStart (node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter (draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },
    // TODO:leave哪一个就是我们需要的插入的类别，也就是当前拖拽的节点的新分类
    handleDragLeave (draggingNode, dropNode, ev) {
      console.log('当前插入的新的父类: ', dropNode.label)
    },
    handleDragOver (draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
    },
    // 都采用inser模式，运行拖拽节点插入在level = 1 的
    allowDrop (draggingNode, dropNode, type) {
      return type !== 'inner'
    },
    // 判断节点能否被拖拽，如果当前的节点不允许被拖拽的话返回true
    allowDrag (draggingNode) {
      return draggingNode.data.level !== 1
    },

    // 对应的类别操纵
    edit (data) {
      console.log(data)
      this.varyForm.varyName = data.label
      this.varyForm.id = data.id
      this.dialogFormVisible = true
      // const newChild = { id: id++, label: 'testtest', children: [] }
      // if (!data.children) {
      //   this.$set(data, 'children', [])
      // }
      // data.children.push(newChild)
    },

    remove (node, data) {
      console.log(data)
      this.$confirm('此操作将永久删除此类别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let loading = this.$myLoading('删除中...')
        deleteVary(data).then((result) => {
          loading.close()
          this.searchVarys()
        }).catch((err) => {
          loading.close()
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    handleNodeClick (data) {
      console.log(data)
      this.isSelect = false;
      [this.isShowLevel1, this.isShowLevel2] = this.getBol(data.level)
    },
    getBol (val) {
      if (val === 1) {
        return [false, false]
      } else if (val === 2) {
        return [true, false]
      } else if (val === 3) {
        return [true, true]
      }
    },
    editSubmission () {
      let loading = this.$myLoading('修改中...')
      console.log(this.varyForm)
      let data = null
      for (let i = 0; i < this.varyDatas.length; i++) {
        if (this.varyDatas[i].kid === this.varyForm.id) {
          data = this.varyDatas[i]
          break
        }
      }
      data.kindName = this.varyForm.varyName
      console.log(data)
      updateVary(data).then(res => {
        loading.close()
        this.searchVarys()
      }).catch(errs => { loading.close() })
    },
    deleteMechanism () {
      this.$confirm('是否确认删除该机构, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitForm1 (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm1 (formName) {
      this.$refs[formName].resetFields()
    },
    reset () {
      for (let key in this.searchInfo) {
        if (key === 'size' || key === 'indexPageNum') {
          console.log(111)
        } else {
          this.searchInfo[key] = ''
        }
      }
    }
  }
}

</script>

<style scoped>
  .mg1 {
    margin-top: 0px !important;
  }

  .operatio {
    margin-top: -10px;
    margin-left: 65px;
  }

  .operatio h4 {
    margin-top: -5px;
    margin-left: 15px;
    float: left;
  }

  .operatio .el-button {
    margin-top: -35px !important;
    width: 35px;
    height: 35px;
    padding: 8px;
    margin-left: 10px;

  }
  .form-wrap{
    margin-left: -30px;
    margin-top: 10px;
  }
  .form-wrap .change-select{
    width: 100%;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .operate i:hover{
    color: #409EFF;
  }

</style>
