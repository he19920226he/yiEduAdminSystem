<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-22 17:18:24
 -->
<template>
  <d2-container>
    <template slot="header">用户订单</template>
    <div class="adminer">
      <el-row class="d2-mb-10" :gutter="40">
        <el-col :span="8">
          <el-input
            @keyup.enter.native="searchByKeyword"
            placeholder="请输入課程名稱"
            prefix-icon="el-icon-search"
            v-model="searchInfo.cname"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <el-input
            @keyup.enter.native="searchByKeyword"
            placeholder="请输入價格"
            prefix-icon="el-icon-search"
            v-model="searchInfo.price"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <el-select placeholder="请选择支付状态" v-model="searchInfo.onpay" style="width:100%!important;">
            <el-option
              v-for="(item,index) in orderStatus"
              :key="index"
              :label="item.lable"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-date-picker
            style="width:94%!important;"
            v-model="searchInfo.courseTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="8">
          <el-input
            @keyup.enter.native="searchByKeyword"
            placeholder="请输入教師名稱"
            prefix-icon="el-icon-search"
            v-model="searchInfo.tecname"
          ></el-input>
        </el-col>
        <el-col :span="8" style="padding-left:30px!important;padding-top:5px!important;">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="searchStudentOrder"
          >查询</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="reset">重置</el-button>
        </el-col>
      </el-row>
      <el-row class="d2-mb-10">
        <p class="info">用户订单信息</p>
      </el-row>
      <!-- 封装的本系统的全局表格组件 -->
      <table-page
        :tableDatas="showDatas.orderDatas"
        :tableHeader="showDatas.orderAttributs"
        :operateWay="showDatas.operateData"
        :pageInfos="showDatas.pageInfos"
        @operate="operateFun"
        @changePageSize="changeSize"
        @changCurrentePage="changPage"
      />

      <!-- 编辑管理员信息,表单组件类型很多不好像封装表格那样。所以这里就不全局封装了，数据封装一下就行 -->
      <el-dialog title="编辑管訂單信息" :visible.sync="dialogFormVisible">
        <el-form
          :inline="true"
          :model="formAdminer"
          :rules="rules"
          ref="formAdminer"
          class="demo-form-inline"
        >
          <el-form-item label="管理员名称" prop="name">
            <el-input v-model="formAdminer.name" placeholder="管理员名称"></el-input>
          </el-form-item>
          <el-form-item label="管理员手机号" prop="phone">
            <el-input v-model="formAdminer.phone" placeholder="管理员手机号"></el-input>
          </el-form-item>
          <el-form-item label="管理员密码" prop="password">
            <el-input show-password v-model="formAdminer.password" placeholder="管理员密码"></el-input>
          </el-form-item>
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
import { multiCriteriaQuery } from '@/api/user/searchUserOrder.js'
import { selectStudentById } from '@/api/user/searchUser.js'
export default {
  name: 'searchUser',
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
    }
    return {
      searchInfo: {
        cname: '',
        price: '',
        onpay: '',
        tecname: '',
        size: 6, // 分页的每一页数目
        indexPageNum: 1, // 当前分页的页码
        state: '',
        courseTime: ''
      },
      orderStatus: [
        {
          value: 0,
          lable: '未支付'
        },
        {
          value: 1,
          lable: '已支付'
        },
        {
          value: 2,
          lable: '已過期'
        }
      ],
      // 页面需要渲染的数据:包括当前页面以及制作复用子组件，渲染的数据是需要传递给子组件的。
      showDatas: {
        orderDatas: [],
        // 定义表格头部数据：一般是固定自己需要的几个字段:所以可以直接在这里定义:也算是定义渲染的模板对象
        orderAttributs: [
          {
            attributes: 'orderId',
            name: '訂單编号',
            // 配置每一列的宽度，如果是为了全屏显示的话最后一个不要配置宽度
            width: '180'
          },
          // 根據id查詢
          {
            attributes: 'stuname',
            name: '學生名稱',
            width: '180'
          },
          {
            attributes: 'cid',
            name: '課程編號',
            width: '180'
          },
          {
            attributes: 'price',
            name: '訂單價格',
            width: '180'
          },
          {
            attributes: 'onpayText',
            name: '訂單狀態',
            width: '100'
          },
          {
            attributes: 'addtime',
            name: '訂單產生時間',
            width: '150'
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
      OrderDatas: [], // 获取的订单最先存储在这里
      dialogFormVisible: false,
      // 表单相关：数据、验证
      formAdminer: {
        id: '',
        name: '',
        password: '',
        phone: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入管理员名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入管理员密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        // 没有手机校验规则，所以自定义校验规则
        phone: [{ validator: checkPhone, trigger: 'blur' }]
      },
      formLabelWidth: '120px'
    }
  },
  mounted () {
    this.searchStudentOrder()
  },
  methods: {
    searchStudentOrder () {
      let loading = this.$myLoading('查询中...')
      // 多添加查询的query过滤处理
      let data = this.getQuery()
      // 开始查询
      multiCriteriaQuery(data)
        .then(res => {
          console.log(res)
          this.orderDatas = res
          this.datasShow()
          loading.close()
        })
        .catch(errs => {
          loading.close()
        })
    },
    datasShow () {
      if (this.orderDatas.message === '无数据') {
        this.showDatas.orderDatas = []
      } else {
        this.showDatas.orderDatas = []
        if (Array.isArray(this.orderDatas.data)) {
          // this.showDatas.orderDatas = res.data
          //  从根据分页siez和当前页数从所有数据中获取对应数目的数据
          let realShowDatas = []
          for (let i = 0; i < this.searchInfo.size; i++) {
            // 计算开始截取的位置
            let cliNum = (this.searchInfo.indexPageNum - 1) * this.searchInfo.size
            if (this.orderDatas.data[cliNum + i]) {
              realShowDatas.push(this.orderDatas.data[cliNum + i])
            }
          }
          for (let i = 0; i < realShowDatas.length; i++) {
            console.log(0)
            this.searchStudentsById(realShowDatas[i].stuid, i, realShowDatas[i])
          }
        }
      }
      let isShow = !(this.orderDatas.count === 0 || this.orderDatas.count === 1)
      // TODO:分页总数目需要加上去
      this.showDatas.pageInfos = {
        totalPage: this.orderDatas.count,
        pageSize: [6, 12, 24, 36],
        isShowPage: isShow
      }
    },
    searchStudentsById (id, index, orderInfo) {
      let data = {
        id: id
      }
      selectStudentById(data)
        .then(res => {
          console.log(res)
          // this.showDatas.orderDatas.push(orderInfo)
          console.log(res.data.stuname == null, res.data.stuname)
          orderInfo.stuname = res.data.stuname == null ? '无名' : res.data.stuname
          orderInfo.onpayText = orderInfo.onpay === 0 ? '未支付' : orderInfo.onpay === 1 ? '已支付' : '已过期'
          // 注册时间：毫秒转正常的时间格式
          orderInfo.addtime = this.DateFormate(
            orderInfo.addtime
          )
          for (let key in orderInfo) {
            if (orderInfo[key] === null) {
              orderInfo[key] = '暂无信息'
            }
          }
          this.showDatas.orderDatas.push(orderInfo)
        })
        .catch(erors => {
          console.log(erors)
        })
    },
    // 毫秒转时间格式
    DateFormate (time) {
      var date = new Date(time)
      return `${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      }-${date.getDay() < 10 ? '0' + (date.getDay() + 1) : date.getDay() + 1}`
    },
    getQuery () {
      // 根据不为空的字段获取实际的query
      let obj = {}
      for (let key in this.searchInfo) {
        if (this.searchInfo[key] !== '' && this.searchInfo[key] !== null) {
          if (key === 'size') {
            obj['pageSize'] = this.searchInfo[key]
          } else if (key === 'indexPageNum') {
            obj['pageNum'] = this.searchInfo[key]
          } else if (key === 'courseTime') {
            obj['beforeDate'] = this.searchInfo[key][0]
            obj['afterDate'] = this.searchInfo[key][1]
          } else {
            obj[key] = this.searchInfo[key]
          }
        }
      }
      console.log(obj)
      return obj
    },
    searchByKeyword () {
      this.searchStudentOrder()
    },
    // 子组件通过emit触发@xxx事件，函数定义在这里，接受到子组件传递的数据之后写相关业务逻辑
    operateFun (ind, type) {
      if (type === '编辑') {
        this.$message('暫未開放')
        // let loading = this.$myLoading('数据加载中...')
        // loading.close()
        // this.dialogFormVisible = !this.dialogFormVisible
        // //! 信息回显到表单:注意表格的一条记录数据从后台获取，但是我们通过字段过滤显示部分数据。但是记录里面是全部的信息，目的是为了
        // //! 回显信息到表单。
        // let curetnInfo = this.showDatas.orderDatas[ind]
        // for (const key in this.formAdminer) {
        //   if (this.formAdminer.hasOwnProperty(key)) {
        //     this.formAdminer[key] = curetnInfo[key]
        //   }
        // }
      } else {
        //  删除信息
        this.$confirm('此操作将删除管理员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message('暫未開放')
            // 删除管理员
            // let orderId = this.showDatas.orderDatas[ind].id
            // console.log(orderId)
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
