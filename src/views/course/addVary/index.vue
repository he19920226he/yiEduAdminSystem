<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-24 23:18:03
 -->
<template>
    <d2-container>
        <template slot="header">添加分类</template>
        <div class="addVary">
            <el-row class="d2-mb-10" :gutter="40">
                <el-col :span="12">
                    <el-select placeholder="请先择级要添加的级别"  v-model="searchInfo.level" style="width:100%!important;" v-on:change="change">
                    <el-option label="一级类别" :value="1"></el-option>
                    <el-option label="二级类别" :value="2"></el-option>
                     <el-option label="三级类别" :value="3"></el-option>
                </el-select>
                </el-col>
            </el-row>
            <hr/>

            <el-form :model="formPermission" :rules="rules" ref="formPermission" class="demo-form-inline">
                <el-row :gutter="50">
                    <el-col :span="12">
                        <el-form-item :label="levelText1" prop="parenttitle" v-show="searchInfo.level !== 1">
                            <el-select
                                    v-model="formPermission.kid1"
                                    :placeholder="levelText2"
                                    style="width: 100%;"
                            >
                                <el-option
                                        v-for="(item,index) in vary"
                                        :key="index"
                                        :label="item.kindName"
                                        :value="item.kid"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="50">
                    <el-col :span="12">
                        <el-form-item  label="请输入类别名称" prop="label">
                            <el-input v-model="formPermission.label" placeholder="类别名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="25" style="text-align: center;padding-right: 50px;">

                    <el-button type="primary"  @click="add">确 定</el-button>
                    <el-button >重置</el-button>

                </el-row>
            </el-form>
        </div>
    </d2-container>
</template>

<script>

import { addKind } from '@/api/course-vary/addVary.js'
import { getHigherLevel } from '@/api/course-vary/getHigherLevel.js'
export default {
  name: 'addVary',
  data () {
    return {
      levelText1: '',
      levelText2: '',
      searchInfo: {
        level: 1// 默认是显示添加一级类别名称
      },
      vary: [],
      // 表单相关：数据、验证
      formPermission: {
        kid1: '', // 一级类别id
        label: ''
      },
      rules: {
        firstLevel: [
          { required: true, message: '请选择权限所属功能模块', trigger: 'change' }
        ],
        label: [
          { required: true, message: '请输入权限页面标题', trigger: 'blur' }
        ]
        // icon: [{ required: true, message: '请输入页面图标', trigger: 'blur' }]
      }
    }
  },
  mounted () {

  },
  methods: {
    add () {
      if (this.searchInfo.level === 1) {
        let data = {
          kindName: this.formPermission.label,
          level: 1
        }
        addKind(data).then(res => {

        }).catch(errs => {})
      } else {
        let data = {
          kindName: this.formPermission.label,
          level: this.searchInfo.level,
          higherId: this.formPermission.kid1
        }
        addKind(data).then(res => {

        }).catch(errs => {})
      }
    },
    change () {
      this.formPermission.kid1 = ''
      if (this.searchInfo.level === 1) {
        return
      }
      let data = {
        level: this.searchInfo.level
      }
      getHigherLevel(data.level).then(res => {
        console.log(res)
        if (res.data != null) {
          this.vary = res.data
        }
      }).catch(errs => {})
      if (this.searchInfo.level === 2) {
        this.levelText1 = '一级类别'
        this.levelText2 = '请选择新添加类别上面的父级类别'
      } else {
        this.levelText1 = '二级类别'
        this.levelText2 = '请选择其上面的父级类别'
      }
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
