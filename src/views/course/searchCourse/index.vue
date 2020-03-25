<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-12-12 02:00:37
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-25 14:34:09
 -->
<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-23 16:16:18
 -->
<template>
  <d2-container>
    <template slot="header">课程查询</template>
    <div class="searchCourse">
      <el-row class="d2-mb-10" :gutter="40">
        <el-col :span="6">
          <el-input
                  @keyup.enter.native="searchByKeyword"
                  placeholder="请输入学生手机号"
                  prefix-icon="el-icon-search"
                  v-model="searchInfo.phone"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-input
                  @keyup.enter.native="searchByKeyword"
                  placeholder="请输入课程名称"
                  prefix-icon="el-icon-search"
                  v-model="searchInfo.cname"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-input
                  @keyup.enter.native="searchByKeyword"
                  placeholder="请输入教师名称"
                  prefix-icon="el-icon-search"
                  v-model="searchInfo.tecname"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-input
                  @keyup.enter.native="searchByKeyword"
                  placeholder="请输入课程类别"
                  prefix-icon="el-icon-search"
                  v-model="searchInfo.kindName"
          ></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" >
          <el-select v-model="searchInfo.price" placeholder="请选择课程价格" style="width: 90%;">
            <el-option label="免费" :value="0"></el-option>
            <el-option label="付费" :value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
                  style="width:90%!important;"
                  v-model="searchInfo.courseTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col  :span="6" style="text-align: left;padding-left: -30px!important;">
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchCourses">查询</el-button>
          <el-button  icon="el-icon-refresh" size="small" @click="reset">重置</el-button>
        </el-col>
      </el-row>
      <el-row class="d2-mb-10">
        <p class="info">课程信息</p>
      </el-row>
      <!-- 封装的本系统的全局表格组件 -->
      <table-page
        :tableDatas="showDatas.courseDatas"
        :tableHeader="showDatas.courseAttributs"
        :operateWay="showDatas.operateData"
        :pageInfos="showDatas.pageInfos"
        @operate="operateFun"
        @changePageSize="changeSize"
        @changCurrentePage="changPage"
      />

      <!-- TODO:看看这里的备注：关于进入课程的编辑页面：tab:分为基本信息编辑、课程视频编辑、课程试题编辑。这样课程列表的操作：编辑、删除编辑管理员信息,表单组件类型很多不好像封装表格那样。所以这里就不全局封装了，数据封装一下就行 -->
      <el-dialog title="编辑课程信息" :visible.sync="dialogFormVisible" width='70%' >
        <el-tabs v-model="activeName" @tab-click="handleClick">

          <el-tab-pane label="课程基本信息" name="first">
 <el-form
        :model="formCourse"
        :rules="rules"
        ref="formCourse"
        class="demo-form-inline"
      >
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="课程类别" prop="kid" style="width:100%!important;">
              <el-select v-model="formCourse.kid" placeholder="请选择课程类别" style="width:100%!important;">
                <el-option v-for="(item,index) in vary" :key="index"  :label="item.kindName"  :value="item.kid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程教师" prop="tecid" style="width:100%!important;">
              <el-select v-model="formCourse.tecid" placeholder="请选择课程教师" style="width:100%!important;">
                <el-option v-for="(item,index) in teachers" :key="index"  :label="item.tecname"  :value="item.tecid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="课程名" prop="cname">
              <el-input v-model="formCourse.cname " placeholder="课程名字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总分数" prop="score">
              <el-input v-model.number="formCourse.score" placeholder="课程总分数"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="课程时长" prop="crouseTime">
              <el-input v-model.number="formCourse.crouseTime" placeholder="课程时长"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程价格" prop="price">
              <el-input v-model.number="formCourse.price" placeholder="课程价格"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="积分值" prop="integral">
              <el-input v-model.number="formCourse.integral" placeholder="课程积分值"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="课程图片" prop="img">
              <el-input type="input" v-model="formCourse.img" placeholder="课程图片"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
<!-- 课程图片展示-->
   <el-row :gutter="50" v-if="formCourse.img!=='' && formCourse.img!=='暂无信息' ">
     <el-col :span="12"  :offset="12" style="height:150px;text-align: center;">
       <!--预览图片的地方-->
       <el-image
               style="width:95%; height:100%"
               :src="formCourse.img"
               fit="contain"></el-image>
     </el-col>
   </el-row>
        <el-row :gutter="50">
          <el-col :span="24">
            <el-form-item label="课程介绍" prop="crouseIntroduce">
              <el-input type="textarea" v-model="formCourse.crouseIntroduce" placeholder="课程介绍"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
          </el-tab-pane>
          <el-tab-pane label="课程视频" name="second">

            <el-table
                    :data="videoInfoData"
                    border
                    style="width: 100%">
              <el-table-column
                      prop="vid"
                      label="视频编码"
                      width="100">
              </el-table-column>
              <el-table-column
                      prop="title"
                      label="视频标题"
                      width="200">
              </el-table-column>
              <el-table-column
                      prop="videoIntroduce"
                      label="介绍"
                      width="250">
              </el-table-column>
              <el-table-column
                      prop="vurl"
                      label="播放地址"
                      width="300">
              </el-table-column>
              <el-table-column

                      label="操作">
                <template slot-scope="scope">
                  <el-button @click="editVideo(scope.row)" type="text" size="small">编辑</el-button>
                   <el-button type="text" size="small" @click="playVideo(scope.row)">播放</el-button>
                  <el-button type="text" size="small" @click="deleteVideo(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

          </el-tab-pane>
          <el-tab-pane label="上传新视频" name="third">

            <el-row style="padding-right:250px;">
              <el-col :span="12" :offset="6" style="min-width:300px;">

                <el-form :model="videoInfo" :rules="videoRules" ref="videoInfo" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="视频标题" prop="title">
                    <el-input type="input" v-model="videoInfo.title" placeholder="视频标题格式1-1 xx视频"></el-input>
                  </el-form-item>
                </el-form>

              </el-col>
            </el-row>
            <el-row :gutter="10" style="padding-right:270px;">
              <el-col :span="12" :offset="8" style="min-width:300px;">
                <el-upload
                        class="upload-demo"
                        drag
                        :data="videoInfo"
                        :with-credentials="true"
                        :action="uploadUrl"
                        :on-success="handleVideoSuccess"
                        :before-upload="beforeUploadVideo"
                        :on-progress="videoProgress"
                        :on-preview="showVideo"
                        :on-error="uploadError"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    将视频拖到此处，或
                    <em>点击上传</em>
                  </div>
                  <div class="el-upload__tip" slot="tip">请保证视频格式正确，且一次大小不超过600M</div>
                </el-upload>
              </el-col>
            </el-row>
            <!-- 视频上传进度条 -->
            <el-row style="padding-right:190px;" v-if="isUpload">
             <el-col :span="14" :offset="6" style="min-width:300px;">

               <el-progress :percentage="uploadProgess"></el-progress>

              </el-col>

            </el-row>
            <el-row :gutter="10" style="padding-left:20px;">
              <el-col :span="12" :offset="4" style="min-width:300px;">
                <video v-if="videoSrc!==''" :src="videoSrc" id="myVideo" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" data-setup='{}' style='width:100%; height: auto;'>
                  您的浏览器不支持视频播放
                </video>
              </el-col>
            </el-row>

          </el-tab-pane>
          <el-tab-pane label="课程试题" name="forth"><h4>抱歉，功能模块暂未开发，敬请期待！</h4></el-tab-pane>
        </el-tabs>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editBase('formCourse')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 视频信息便捷dialog -->
      <el-dialog :title="operateVideInfo" :visible.sync="dialogFormVisible1" @close="videoDialogClose">
        <div class="editVideo-wrap" v-if="isType === '编辑视频'">
          <el-form :model="formVideo" :rules="videoFormRules">
    <el-form-item label="视频标题" prop="title">
      <el-input v-model="formVideo.title" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="视频简介"  >
      <el-input  type="textarea" autosize v-model="formVideo.videoIntroduce" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible1 = false ">取 消</el-button>
    <el-button type="primary" @click="confirmUpdateVideo">确 定</el-button>
  </div>
        </div>
        <div class="watchVido-wrap"  v-if="isType === '播放视频'">
           <el-row :gutter="10"  style="padding-left: 50px!important;">
              <el-col :span="12" :offset="4">
                <video  ref="currentVideo" :src="currentPlayVideoSrc"  class="video-js vjs-default-skin vjs-big-play-centered" controls preload="meta" data-setup='{}' style='width: 100%;height: auto'>
                  您的浏览器不支持视频播放
                </video>
              </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible1 = false">关闭</el-button>
      <el-button type="info" @click="refresh()" title="网络中断或网速慢可以点击刷新视频">刷新</el-button>
  </div>
        </div>

</el-dialog>
    </div>
  </d2-container>
</template>

<script>

import { courseSelect } from '@/api/course-vary/searchCourse.js'
import { updateCourseBase } from '@/api/course-vary/updateCourse.js'
import { deleteCourse } from '@/api/course-vary/removeCourse.js'
import { getVideoByCid } from '@/api/course-vary/getVideoByCid.js'
import { selectAllVary } from '@/api/course-vary/selectAll.js'
import { teacherSelect } from '@/api/user/searchUser.js'
import { updateVidoe } from '@api/course-vary/updateVidoe.js'
import { deleteVideo } from '@api/course-vary/deleteVideo.js'
export default {
  name: 'searchCourse',
  data () {
    return {
      searchInfo: {
        kindName: '',
        cname: '',
        price: '',
        tecname: '',
        phone: '',
        size: 6, // 分页的每一页数目
        indexPageNum: 1, // 当前分页的页码
        courseTime: ''
      },
      operateVideInfo: '修改视频',
      currentPlayVideoSrc: '',
      isType: '播放视频',
      // 页面需要渲染的数据:包括当前页面以及制作复用子组件，渲染的数据是需要传递给子组件的。
      showDatas: {
        courseDatas: [],
        // 定义表格头部数据：一般是固定自己需要的几个字段:所以可以直接在这里定义:也算是定义渲染的模板对象
        courseAttributs: [
          {
            attributes: 'cid',
            name: '课程编码',
            // 配置每一列的宽度，如果是为了全屏显示的话最后一个不要配置宽度
            width: '130'
          },
          {
            attributes: 'cname',
            name: '课程名称',
            width: '250'
          },
          {
            attributes: 'score',
            name: '课程总分数',
            width: '200'
          },
          {
            attributes: 'crouseTime',
            name: '课程时长',
            width: '250'
          },
          {
            attributes: 'price',
            name: '课程价格',
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
          pageSize: [6], // 定义可以调整每一页显示数目
          isShowPage: false // false：不显示分页控件
        },
        loadinInfo: {
          isLoading: false,
          info: '确定修改'
        }
      },
      courseDatas: [], // 获取的课程信息保存在这里，要来实现前端分页
      formVideo: {
        title: '',
        videoIntroduce: '',
        vid: '',
        cid: '',
        vurl: ''
      },
      videoFormRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      // 表单相关：数据、验证
      formCourse: {
        cid: '',
        addDay: '',
        kid: '',
        cname: '', // 课程名
        score: '', // 课程成绩
        crouseTime: '', // 课程时长
        price: '', // 课程价格
        integral: '', // 积分值
        crouseIntroduce: '', // 课程介绍
        tecid: '', // 课程教师
        img: ''
      },
      teachers: [],
      vary: [],
      rules: {
        cname: [{ required: true, message: '请输入课程名字', trigger: 'blur' }],
        score: [
          { required: true, message: '请输入课程成绩', trigger: 'blur' },
          { type: 'number', message: '分数必须为数字' }
        ],
        crouseTime: [
          { required: true, message: '请输入课程时长', trigger: 'blur' },
          { type: 'number', message: '时长必须为数字' }
        ],
        price: [
          { required: true, message: '请输入课程价格', trigger: 'blur' },
          { type: 'number', message: '价格必须为数字' }
        ],
        integral: [
          { required: true, message: '请输入课程积分', trigger: 'blur' },
          { type: 'number', message: '积分必须为数字' }
        ]
      },
      videoInfo: {
        cid: '',
        title: ''
      },
      // 视频上传地址 mounted钩子处加全局环境变量保存的baseurl
      uploadUrl: 'videoInfo/upload',
      videoSrc: '', // 上传视频完成后返回的视频地
      uploadProgess: 0, // 视频上传进度
      isUpload: false, // 是否正在上传视频
      videoRules: {
        title: [
          { required: true, message: '请输入视频标题名称', trigger: 'blur' },
          { min: 3, max: 30, message: '标题长度在 3 到 30 个字符', trigger: 'blur' }
        ]
      },
      menuIcons: [],
      activeName: 'first',
      videoInfoData: [],
      currentId: ''
    }
  },
  mounted () {
    this.searchCourses()
    this.searchAllVary()
    this.searchAllTeacher()
    //  由于环境变量在这无法使用，所以根据开发环境来判断使用那一个baseurl
    if (process.env.NODE_ENV === 'development') {
      // this.uploadUrl = process.env.VUE_APP_API + this.uploadUrl
      this.uploadUrl = `http://localhost:8080/${this.uploadUrl}`
    } else if (process.env.NODE_ENV === 'production') {
      this.uploadUrl = `http://47.103.223.248:8095/YIedu/${this.uploadUrl}`
    }

    console.log(this.uploadUrl)
  },
  methods: {
    searchAllVary () {
      selectAllVary().then(res => {
        console.log(res)
        this.vary = res.data
      }).catch(erros => {})
    },
    searchAllTeacher () {
      let data = {
        pageNum: 1,
        pageSize: 1000
      }
      teacherSelect(data).then(res => {
        this.teachers = res.data
      }).catch(erros => {})
    },

    searchCourses () {
      let loading = this.$myLoading('查询中...')
      // 多添加查询的query过滤处理
      let data = this.getQuery()
      // 开始查询
      courseSelect(data).then(res => {
        console.log(res)
        this.datasShow(res)
        loading.close()
      }).catch(errs => {
        loading.close()
      })
    },
    datasShow (res) {
      if (res.message === '无数据') {
        this.showDatas.courseDatas = []
      } else {
        this.showDatas.courseDatas = []
        if (Array.isArray(res.data)) {
          // this.showDatas.courseDatas = res.data
          //  从根据分页siez和当前页数从所有数据中获取对应数目的数据
          let realShowDatas = []
          for (let i = 0; i < this.searchInfo.size; i++) {
            // 计算开始截取的位置
            let cliNum = (this.searchInfo.indexPageNum - 1) * this.searchInfo.size
            if (res.data[cliNum + i]) {
              realShowDatas.push(res.data[cliNum + i])
            }
          }
          for (let i = 0; i < realShowDatas.length; i++) {
            for (let key in realShowDatas[i]) {
              if (realShowDatas[i][key] === null) {
                realShowDatas[i][key] = '暂无信息'
              }
            }
          }
          this.showDatas.courseDatas = realShowDatas
        } else {
          this.showDatas.courseDatas.push(res.data)
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
            console.log(this.searchInfo[key])
          } else {
            obj[key] = this.searchInfo[key]
          }
        }
      }
      console.log(obj)
      return obj
    },
    searchByKeyword () {
      this.searchCourses()
    },
    reset () {
      for (let key in this.searchInfo) {
        if (key === 'size' || key === 'indexPageNum') {
          console.log(111)
        } else {
          this.searchInfo[key] = ''
        }
      }
    },
    // 编辑课程dialog里面的tab切换触发
    handleClick () {
      console.log(this.activeName)
      if (this.activeName === 'second') {
        this.getVidoes()
      }
    },
    // 根据cid获取课程视频
    getVidoes () {
      let data = {
        cid: this.currentId
      }
      let loading = this.$myLoading('查询中...')
      getVideoByCid(data).then(res => {
        loading.close()
        console.log(res)
        if (res.count !== 0) {
          this.videoInfoData = res.data
          for (var i = 0; i < this.videoInfoData.length; i++) {
            for (let key in this.videoInfoData[i]) {
              this.videoInfoData[i][key] = this.videoInfoData[i][key] === '' || this.videoInfoData[i][key] === null ? '暂无信息' : this.videoInfoData[i][key]
            }
          }
        }
      }).catch(errs => { loading.close() })
    },
    editVideo (item) {
      this.dialogFormVisible1 = true
      this.operateVideInfo = '修改视频'
      this.isType = '编辑视频'
      for (const key in this.formVideo) {
        if (this.formVideo.hasOwnProperty(key)) {
          this.formVideo[key] = item[key]
        }
      }
    },
    // 播放视频
    playVideo (item) {
    // 判断是否网络正常,兼容性chrome12+
      if (window.navigator.onLine !== true) {
        this.$message({
          type: 'error',
          message: '网络断掉了，请重新连接网络后点击刷新按钮'
        })
      }
      this.dialogFormVisible1 = true
      this.operateVideInfo = '播放视频'
      this.isType = '播放视频'
      this.currentPlayVideoSrc = item.vurl
      //  网络原因，视频第一次载入的时候；这里preload设置为meta，只预先加载元素数据，但是这里判断一下网络状态还是有必要的

      // 监听视频播放错误状态
      setTimeout(() => {
        this.videoError()
      }, 1000)
    },
    // 监听视频播放过程错误，以及根据视频时长这一元数据来判断首次载入视频资源是否成功：主要是为了避免首次播放视频前网络连接突然断掉了
    videoError () {
      if (!this.$refs.currentVideo.duration) {
        this.$message({
          type: 'error',
          message: '视频加载错误，请检查网络后点击刷新按钮试试'
        })
      }
      this.$refs.currentVideo.addEventListener('error', () => {
        this.$message({
          type: 'error',
          message: '视频加载错误，请检查网络后点击刷新按钮试试'
        })
      })
    },
    // 重新刷新视频
    refresh () {
      console.log(this.$refs.currentVideo.src)
      this.$refs.currentVideo.src = this.$refs.currentVideo.src
    },
    // 监听视频编辑播放dialog的关闭，做处理
    videoDialogClose () {
      if (this.isType === '播放视频') {
        this.$refs.currentVideo.pause()
        this.dialogFormVisible1 = false
      }
    },
    // 删除视频
    deleteVideo (item) {
      console.log(item)
      this.$confirm('此操作将永久删除视频, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let loading = this.$myLoading('删除中...')
        deleteVideo(item).then((result) => {
          loading.close()
          this.getVidoes()
        }).catch((err) => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    confirmUpdateVideo () {
      let loading = this.$myLoading('修改中...')
      updateVidoe(this.formVideo).then((result) => {
        loading.close()
        this.dialogFormVisible1 = false
        this.getVidoes()
      }).catch(() => {
        loading.close()
      })
    },

    // 子组件通过emit触发@xxx事件，函数定义在这里，接受到子组件传递的数据之后写相关业务逻辑
    operateFun (ind, type) {
      if (type === '编辑') {
        let loading = this.$myLoading('数据加载中...')
        loading.close()
        this.dialogFormVisible = !this.dialogFormVisible
        //! 信息回显到表单:注意表格的一条记录数据从后台获取，但是我们通过字段过滤显示部分数据。但是记录里面是全部的信息，目的是为了
        //! 回显信息到表单。
        let curetnInfo = this.showDatas.courseDatas[ind]
        console.log(curetnInfo)
        this.currentId = this.showDatas.courseDatas[ind].cid
        this.videoInfo.cid = this.showDatas.courseDatas[ind].cid
        for (const key in this.formCourse) {
          this.formCourse[key] = curetnInfo[key]
        }
      } else {
        //  删除信息
        this.$confirm('此操作将删除此课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // 删除管理员
            let loading = this.$myLoading('删除中...')
            let cId = this.showDatas.courseDatas[ind].cid
            console.log(cId)
            let data = {
              cid: cId
            }
            deleteCourse(data).then(res => {
              console.log(res)
              loading.close()
              this.searchCourses()
            }).catch(errs => { loading.close() })
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
    },
    // 确定修改基本信息
    editBase (formName) {
      if (this.activeName === 'first') {
        this.$refs[formName].validate((valid) => {
          console.log(valid)
          if (valid) {
            console.log(this.formCourse)
            let loading = this.$myLoading('修改中...')
            updateCourseBase(this.formCourse).then(res => {
              loading.close()
              console.log(res)
              this.searchCourses()
              this.dialogFormVisible = false
            }).catch(errs => {
              loading.close()
            })
          } else {
            this.$message.error('输入内容有误，请检查对应输入框')
            return false
          }
        })
      } else if (this.activeName === 'third') {
        console.log(this.videoInfo)
      }
    },
    // 上传视频前对文件格式进行验证，以及对额外参数的表单进行一些校验
    beforeUploadVideo (file) {
      this.$refs['videoInfo'].validate((valid) => {
        if (valid) {
        } else {
          // 没有用
          return false
        }
      })
      if (this.videoInfo.title === '') {
        this.$message.error('视频标题信息不能为空，请先填写标题信息')
        return false
      }
      const isLt600M = file.size / 1024 / 1024 > 600
      if (isLt600M) {
        this.$message.error('视频大小不能超过600MB')
        return false
      }
    },
    // 视频上传进度监听
    videoProgress (event, file, fileList) {
      console.log(0)
    },
    // 上传成功后显
    handleVideoSuccess (res, file) {
      this.videoSrc = URL.createObjectURL(file.raw)
      // 保存视频信息
      // let json = {
      //   title: this.videoInfo.title,
      //   videoSrc: URL.createObjectURL(file.raw)
      // }
      // this.videoSave.push(json)
      this.videoInfo.title = ''
    },
    // 点击上传完成的列表文件
    showVideo (file) {
      console.log(file)
    },
    // 上传失败
    uploadError (err, file, fileList) {
      console.log(err)
      this.$message.error('视频上传失败，请重新上传！')
    }
  },
  // 监听dialogFormVisible属性值改变
  watch: {
    dialogFormVisible (value, oldValue) {
      console.log(value, oldValue)
      if (!value) {
        this.activeName = 'first'
      }
    }
  }
}
</script>
<style lang="css" >
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
.el-dialog{
  min-width: 400px;
}
</style>
