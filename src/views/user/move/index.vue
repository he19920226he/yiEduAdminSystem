<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-07 16:31:38
 -->
<template>
  <d2-container>
    <template slot="header">拖拽表格</template>
    <div style="width:800px;">
      <h4 style="text-align:center;">拖拽表格可以实现课程排序</h4>
      <el-table :data="tableData" border row-key="id" align="left">
        <el-table-column
          v-for="(item, index) in col"
          :key="`col_${index}`"
          :prop="dropCol[index].prop"
          :label="item.label"
        ></el-table-column>
      </el-table>
      <pre style="text-align: left">
      {{dropCol}}
    </pre>
      <hr />
      <pre style="text-align: left">
      {{tableData}}
    </pre>
    </div>
  </d2-container>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  name: 'move',
  data () {
    return {
      col: [
        {
          label: '日期',
          prop: 'date'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '地址',
          prop: 'address'
        }
      ],
      dropCol: [
        {
          label: '日期',
          prop: 'date'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '地址',
          prop: 'address'
        }
      ],
      tableData: [
        {
          id: '1',
          date: '2016-05-02',
          name: '王小虎1',
          address: '上海市普陀区金沙江路 100 弄'
        },
        {
          id: '2',
          date: '2016-05-04',
          name: '王小虎2',
          address: '上海市普陀区金沙江路 200 弄'
        },
        {
          id: '3',
          date: '2016-05-01',
          name: '王小虎3',
          address: '上海市普陀区金沙江路 300 弄'
        },
        {
          id: '4',
          date: '2016-05-03',
          name: '王小虎4',
          address: '上海市普陀区金沙江路 400 弄'
        }
      ]
    }
  },
  mounted () {
    setTimeout(() => {
      this.rowDrop()
    }, 500)
  },
  methods: {
    // 行拖拽TODO:Sortable文档
    rowDrop () {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      console.log(tbody)
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0]
          _this.tableData.splice(newIndex, 0, currRow)
        }
      })
    }
  }
}
</script>
