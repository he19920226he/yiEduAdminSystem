<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2020-03-25 15:34:09
 -->
<template>
  <d2-container>
    <template slot="header">添加课程</template>
    <div class="addCourse">
      <!--添加课程步骤条 -->
      <el-row>
        <el-steps :active="stepActive" align-center finish-status="success">
          <el-step title="步骤一" description="添加课程基本信息"></el-step>
          <el-step title="步骤二" description="上传课程视频"></el-step>
          <el-step title="步骤3" description="上传课程试题"></el-step>
          <el-step title="步骤4" description="发布课程"></el-step>
        </el-steps>
      </el-row>

      <!-- 课程基本信息表单 -->
      <transition name="fade">
        <el-form
          v-if="stepActive===0"
          :model="formCourse"
          :rules="rules"
          ref="formCourse"
          class="demo-form-inline"
        >
          <el-row :gutter="50">
            <el-col :span="12">
              <el-form-item label="课程类别" prop="kid" style="width:100%!important;">
                <el-select
                  v-model="formCourse.kid"
                  placeholder="请选择课程类别"
                  style="width:100%!important;"
                >
                  <el-option v-for="(item,index) in vary"  :label="item.kindName" :value="item.kid" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="教师" prop="tecid" style="width:100%!important;">
                <el-select
                        v-model="formCourse.tecid"
                        placeholder="请选择课程教师"
                        style="width:100%!important;"
                >
                  <el-option v-for="(item,index) in teachers"  :label="item.tecname" :value="item.tecid" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
<!--            <el-col :span="8">-->
<!--              <el-form-item label="二级类别" prop="secondId" style="width:100%!important;">-->
<!--                <el-select-->
<!--                  v-model="formCourse.secondId"-->
<!--                  placeholder="请选择二级类别"-->
<!--                  style="width:100%!important;"-->
<!--                >-->
<!--                  <el-option  v-for="(item,index) in secondVary"  :label="item.kindName" :value="item.kid" :key="index"></el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--              <el-form-item label="三级类别" prop="thirdId" style="width:100%!important;">-->
<!--                <el-select-->
<!--                        v-model="formCourse.thirdId"-->
<!--                        placeholder="请选择三级类别"-->
<!--                        style="width:100%!important;"-->
<!--                >-->
<!--                  <el-option  v-for="(item,index) in thirdVary"  :label="item.kindName" :value="item.kid" :key="index"></el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
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
                <el-input type="input" v-model="formCourse.img" placeholder="课程图片--输入图片url"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
<!--上传图片后在这里展示与预览-->
          <el-row :gutter="50" v-if="formCourse.img!==''">
            <el-col :span="12"  :offset="12" style="height:200px;text-align: center;">
<!--预览图片的地方-->
              <el-image
                      style="width:70%; height:90%"
                      :src="formCourse.img"
                      fit="fill"></el-image>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="课程介绍" prop="crouseIntroduce">
                <el-input type="textarea" v-model="formCourse.crouseIntroduce" placeholder="课程介绍"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="9">
              <el-button v-if="stepActive!=0" @click="backStep">返回上一步</el-button>
              <el-button type="success" @click="next('formCourse')">保存</el-button>
            </el-col>
          </el-row>
        </el-form>
      </transition>

      <!-- 视频上传，一次只能上传一个，显示上传进度，成功后显示视频播放 -->
      <transition name="fade">
        <div v-show="stepActive===1" style="margin-top:20px;">
          <el-row >
            <el-col :span="6" :offset="8">

              <el-form :model="videoInfo" :rules="videoRules" ref="videoInfo" label-width="100px" class="demo-ruleForm">
                <el-form-item label="视频标题" prop="title">
                  <el-input type="input" v-model="videoInfo.title" placeholder="视频标题格式1-1 xx视频"></el-input>
                </el-form-item>
              </el-form>

            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6" :offset="8">
              <el-upload
                class="upload-demo"
                drag
                :data="videoInfo"
                :with-credentials="true"
                :action="uploadUrl"
                :on-success="handleVideoSuccess"
                :before-upload="beforeUploadVideo"
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
          <el-row :gutter="10">
            <el-col :span="6" :offset="8">
              <video v-if="videoSrc!==''" :src="videoSrc" id="myVideo" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" data-setup='{}' style='width: 100%;height: auto'>
                您的浏览器不支持视频播放
              </video>
            </el-col>
          </el-row>

          <el-row style="margin-top:20px;">
            <el-col :offset="9" :span="6" style="text-aligin:center;">
              <el-button v-if="stepActive!=0" @click="backStep">返回上一步</el-button>
              <el-button type="success" @click="next">保存</el-button>
            </el-col>
          </el-row>
        </div>
      </transition>

      <!-- 试题上传，一次只能上传一个，显示上传进度，成功后显示视频播放 -->
      <transition name="fade">
        <div v-show="stepActive===2" style="margin-top:20px;">
          <el-row :gutter="10">
            <el-col :span="24" >
              <h4 style="text-align:center;">试题功能模块暂未开放,可以直接保存进入下一步...</h4>
            </el-col>
          </el-row>

          <el-row style="margin-top:20px;">
            <el-col :offset="9" :span="6" style="text-aligin:center;">
              <el-button v-if="stepActive!=0" @click="backStep">返回上一步</el-button>
              <el-button type="success" @click="next">保存</el-button>
            </el-col>
          </el-row>
        </div>
      </transition>

      <!-- 课程信息预览，确认发布 -->
      <transition name="fade">
        <div v-show="stepActive===3">
          <el-row>
            <el-col :span="24" class="center">
              <h4>
                课程信息预览
                <small>检查无误后点击下面按钮发布课程</small>
              </h4>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <h5 class="mainColor left-line">课程基本信息:</h5>
            </el-col>
          </el-row>
          <el-row>
            <el-form

                    :model="formCourse"
                    :rules="rules"
                    ref="formCourse"
                    class="demo-form-inline"
            >
              <el-row :gutter="50">
                <el-col :span="12">
                  <el-form-item label="课程类别" prop="kid" style="width:100%!important;">
                    <el-select
                            v-model="formCourse.kid"
                            placeholder="请选择课程类别"
                            style="width:100%!important;"
                    >
                      <el-option v-for="(item,index) in vary"  :label="item.kindName" :value="item.kid" :key="index"  :disabled="true"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="教师" prop="tecid" style="width:100%!important;">
                    <el-select
                            v-model="formCourse.tecid"
                            placeholder="请选择课程教师"
                            style="width:100%!important;"
                    >
                      <el-option v-for="(item,index) in teachers"  :label="item.tecname" :value="item.tecid" :key="index" :disabled="true"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row :gutter="50">
                <el-col :span="12">
                  <el-form-item label="课程名" prop="cname">
                    <el-input :disabled="true" v-model="formCourse.cname " placeholder="课程名字"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="总分数" prop="score">
                    <el-input  :disabled="true" v-model.number="formCourse.score" placeholder="课程总分数"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="50">
                <el-col :span="12">
                  <el-form-item label="课程时长" prop="crouseTime">
                    <el-input :disabled="true" v-model.number="formCourse.crouseTime" placeholder="课程时长"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="课程价格" prop="price">
                    <el-input :disabled="true" v-model.number="formCourse.price" placeholder="课程价格"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="50">
                <el-col :span="12">
                  <el-form-item label="积分值" prop="integral">
                    <el-input :disabled="true" v-model.number="formCourse.integral" placeholder="课程积分值"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="课程图片" prop="img">
                    <el-input :disabled="true" type="input" v-model="formCourse.img" placeholder="课程图片"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>l
              <el-row>
                <el-col :span="24">
                  <el-form-item label="课程介绍" prop="crouseIntroduce">
                    <el-input :disabled="true" type="textarea" v-model="formCourse.crouseIntroduce" placeholder="课程介绍"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

            </el-form>
          </el-row>

          <el-divider style="margin:0px!important;"></el-divider>

          <el-row>
          <el-col :span="24">
            <h5 class="mainColor left-line">课程视频信息:</h5>
          </el-col>
        </el-row>
          <el-row>
            <el-col :span="24" style="padding: 10px;">
              <a v-for="(item,index) in videoSave" :key="index" @click="watchViedo(item)" class="el-upload-list__item-name"><i class="el-icon-document"></i>{{item.title+'.mp4'}}
              </a>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-button v-if="stepActive!=0" @click="backStep">返回上一步</el-button>
            <el-button type="success" @click="fabu">发布</el-button>
          </el-row>
          <el-row>

          </el-row>
        </div>
      </transition>
      <el-dialog  :title="currentvideoInfo" :visible.sync="dialogTableVisible">
<!-- 播放当前选择的视频-->
        <video  :src="currentvideoSrc"  class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" data-setup='{}' style='margin-left: 5%; width: 90%;height: auto'>
          您的浏览器不支持视频播放
        </video>
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import { addCourseBase } from '@/api/course-vary/addCourse.js'
import { selectAllVary } from '@/api/course-vary/selectAll.js'
import { teacherSelect } from '@/api/user/searchUser.js'
import { updateCourseBase } from '@/api/course-vary/updateCourse.js'
export default {
  name: 'addCourse',
  data () {
    return {
      currentvideoInfo: '',
      currentvideoSrc: '',
      dialogTableVisible: false,
      isaddBase: false,
      isUpdate: false,
      courseBaseInfo: '',
      stepActive: 0, // 添加课程进行到的步骤
      // 表单相关：数据、验证
      formCourse: {
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
      vary: [],
      teachers: [],
      videoInfo: {
        cid: '',
        title: ''
      },
      videoRules: {
        title: [
          { required: true, message: '请输入视频标题名称', trigger: 'blur' }
        ]
      },
      currentCid: '', // 接收第一步添加完课程之后的cid
      videoSave: [], // 每次上传成功一个视频保存其title还有播放地址，方便后面预览
      // 视频上传地址
      uploadUrl: 'videoInfo/upload',
      videoFlag: false, // 视频是否上传完成标志
      videoSrc: '', // 上传视频完成后返回的视频地
      videoUploadPercent: 0, // 上传进度
      // 保存用于预览的数据
      preview: {
        basicCourseInfo: {
          课程一级类别: '前端编程',
          课程二级类别: 'es6教程',
          课程名: '进阶es6',
          总分数: 100,
          课程时长: 1000,
          价格: 1024,
          积分值: 100,
          课程介绍: '非常好、非常好、非常好、非常好、非常好、非常好'
        },
        courseVideo: [], // 已经上传的课程视频文件列表，点击可以观看
        courseTest: [] // 已经上传的课程试题文件列表，点击可以观看
      }
    }
  },
  mounted () {
    this.geFirstVary()
    this.getTeachers()
    //  由于环境变量在这无法使用，所以根据开发环境来判断使用那一个baseurl
    if (process.env.NODE_ENV === 'development') {
      // this.uploadUrl = process.env.VUE_APP_API + this.uploadUrl
      this.uploadUrl = `http://localhost:8080/${this.uploadUrl}`
    } else if (process.env.NODE_ENV === 'production') {
      this.uploadUrl = `http://47.103.223.248:8095/YIedu/${this.uploadUrl}`
    }
  },
  methods: {
    geFirstVary () {
      let data = {
        level: 2
      }
      selectAllVary(data).then(res => {
        console.log(data)
        this.vary = res.data
      }).catch(errs => {})
    },
    getTeachers () {
      let data = {
        pageNum: 1,
        pageSize: 100
      }
      teacherSelect(data).then(res => {
        console.log(res)
        this.teachers = res.data
      }).catch(errs => {

      })
    },
    firstChange () {
      console.log(this.formCourse.firstid)
    },
    handleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
      //! value就是当前被分配的所有的权限id
    },
    next (formName) {
      if (this.stepActive === 3) {
        return
      }
      if (this.stepActive === 0) {
        // 保存课程基本信息
        this.$refs[formName].validate((valid) => {
          console.log(valid)
          if (valid) {
            console.log(this.formCourse)
            let loading = this.$myLoading('修改中...')

            if (this.isaddBase === false) {
              addCourseBase(this.formCourse).then(res => {
                loading.close()
                console.log(res)
                this.isaddBase = true
                // 保存课程id
                this.videoInfo.cid = res.data
                this.stepActive++
              }).catch(errs => {
                loading.close()
              })
            } else {
              // 修改
              this.formCourse.cid = this.videoInfo.cid
              updateCourseBase(this.formCourse).then(res => {
                loading.close()
                this.stepActive++
              }).catch(errs => {
                loading.close()
              })
            }
          } else {
            this.$message.error('输入内容有误，请检查对应输入框')
            return false
          }
        })
      }
      if (this.stepActive === 1 || this.stepActive === 2) {
        this.stepActive++
      }
    },
    backStep () {
      if (this.stepActive === 0) {
        return
      }
      if (this.stepActive === 1) {
        this.isUpdate = true
      }
      this.stepActive--
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
    },
    // 上传成功后显
    handleVideoSuccess (res, file) {
      this.videoSrc = URL.createObjectURL(file.raw)
      // 保存视频信息
      let json = {
        title: this.videoInfo.title,
        videoSrc: URL.createObjectURL(file.raw)
      }
      this.videoSave.push(json)
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
    },

    fabu () {
      this.$message({
        message: '发布成功',
        type: 'success'
      })
      this.stepActive = 0
      for (let key in this.formCourse) {
        this.formCourse[key] = ''
      }
      this.videoInfo.title = ''
      this.geFirstVary()
      this.getTeachers()
    },
    watchViedo (item) {
      this.dialogTableVisible = true
      this.currentvideoInfo = item.title
      this.currentvideoSrc = item.videoSrc
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
/* 切换动画过渡 */
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-active {
  transition: 0.7s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.center {
  text-align: center;
}
.center small {
  color: #909399;
}
.mainColor {
  color: #303133;
}
.left-line {
  border-left: 2px solid #f56c6c;
  padding-left: 4px;
}
.el-upload-list__item-name {
  color: #606266;
  /* display: block; */
  margin-right: 20px;
  overflow: hidden;
  padding-left: 4px;
  text-overflow: ellipsis;
  transition: color .3s;
  white-space: nowrap;
  cursor: pointer;
  display: inline-block;
}
.el-upload-list__item-name [class^=el-icon] {
  height: 100%;
  margin-right: 7px;
  color: #909399;
  line-height: inherit;
}
  .el-upload-list__item-name:hover{
    color: #409eff;
  }
</style>
