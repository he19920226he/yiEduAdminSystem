<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-20 21:48:37
 -->
<template>
    <d2-container>
        <template slot="header">这是一个测试页面</template>
        <div class="test">
            <h3 style="text-align: center;"> 新加的一个菜单页面 </h3>
        </div>
    </d2-container>
</template>

<script>

export default {
  name: 'test',
  data () {
    return {
    }
  },
  mounted () {

  },
  methods: {

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
