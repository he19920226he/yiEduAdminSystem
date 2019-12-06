<!--
 * @Description:
 * @version:
 * @Author: lxw
 * @Date: 2019-11-06 11:06:15
 * @LastEditors: lxw
 * @LastEditTime: 2019-11-21 21:37:30
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
              <el-form-item label="一级类别" prop="Parentkid" style="width:100%!important;">
                <el-select
                  v-model="formCourse.Parentkid"
                  placeholder="请选择一级类别"
                  style="width:100%!important;"
                >
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="二级类别" prop="kid" style="width:100%!important;">
                <el-select
                  v-model="formCourse.kid"
                  placeholder="请选择二级类别"
                  style="width:100%!important;"
                >
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
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
              <el-form-item label="课程时长" prop="crouse_time">
                <el-input v-model.number="formCourse.crouse_time" placeholder="课程时长"></el-input>
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
                <el-input v-model="formCourse.integral" placeholder="课程积分值"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="课程介绍" prop="crouse_introduce">
                <el-input type="textarea" v-model="formCourse.crouse_introduce" placeholder="课程介绍"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="9">
              <el-button v-if="stepActive!=0" @click="backStep">返回上一步</el-button>
              <el-button type="success" @click="next">保存</el-button>
            </el-col>
          </el-row>
        </el-form>
      </transition>

      <!-- 视频上传，一次只能上传一个，显示上传进度，成功后显示视频播放 -->
      <transition name="fade">
        <div v-if="stepActive===1" style="margin-top:20px;">
          <el-row :gutter="10">
            <el-col :span="6" :offset="8">
              <el-upload
                class="upload-demo"
                drag
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
                <div class="el-upload__tip" slot="tip">请保证视频格式正确，且不超过10M</div>
              </el-upload>
            </el-col>
            <el-col :span="6">
              <!-- <video v-if="videoSrc!==''" :src="videoSrc">
                  您的浏览器不支持视频播放
              </video>-->
              <img v-if="videoSrc!==''" :src="videoSrc" />
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
        <div v-if="stepActive===2" style="margin-top:20px;">
          <el-row :gutter="10">
            <el-col :span="6" :offset="8">
              <el-upload
                class="upload-demo"
                drag
                :with-credentials="true"
                :action="uploadUrl"
                :on-success="handleVideoSuccess"
                :before-upload="beforeUploadVideo"
                :on-preview="showVideo"
                :on-error="uploadError"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将试题文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">支持上传文本文件，请确保不要上传文件格式正确，大小不不超过10M</div>
              </el-upload>
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
        <div v-if="stepActive===3">
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
            <el-col
              :span="4"
              v-for="(value,key,index) in preview.basicCourseInfo"
              :key="index"
              style="margin-bottom:25px!important;"
            >
              <div v-if="key!='课程介绍'">
                <span
                  class="attribute"
                  style="color:#000!important;margin-right:20px;"
                  v-text="key+':'"
                ></span>
                <span style="color:#909399!important;" v-text="value"></span>
              </div>
            </el-col>
            <el-col :span="8">
              <span
                class="attribute"
                style="color:#000!important;margin-right:20px;">课程介绍:</span>
              <span style="color:#909399!important;" v-text="preview.basicCourseInfo['课程介绍']"></span>
            </el-col>
          </el-row>

          <el-divider style="margin:0px!important;"></el-divider>

          <el-row>
            <el-col :span="24">
              <h5 class="mainColor left-line">课程视频本信息:</h5>
            </el-col>
          </el-row>
          <el-row>

          </el-row>

           <el-divider style="margin:0px!important;"></el-divider>

          <el-row>
            <el-col :span="24">
              <h5 class="mainColor left-line">课程试题信息:</h5>
            </el-col>
          </el-row>

        </div>
      </transition>
    </div>
  </d2-container>
</template>

<script>
export default {
  name: 'addCourse',
  data () {
    return {
      stepActive: 3, // 添加课程进行到的步骤
      // 表单相关：数据、验证
      formCourse: {
        Parentkid: '',
        kid: '',
        cname: '', // 课程名
        score: '', // 课程成绩
        crouse_time: '', // 课程时长
        price: '', // 课程价格
        integral: '', // 积分值
        crouse_introduce: '' // 课程介绍
      },
      rules: {
        Parentkid: [
          {
            required: true,
            message: '请选择课程一级类别',
            trigger: 'change'
          }
        ],
        kid: [
          {
            required: true,
            message: '请选择课程二级类别',
            trigger: 'change'
          }
        ],
        cname: [{ required: true, message: '请输入课程名字', trigger: 'blur' }],
        score: [
          { required: true, message: '请输入课程成绩', trigger: 'blur' },
          { type: 'number', message: '分数必须为数字' }
        ],
        crouse_time: [
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
        ],
        crouse_introduce: [
          { required: true, message: '请输入课程介绍', trigger: 'blur' }
        ]
      },
      // 视频上传地址
      uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
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
    let loading = this.$myLoading('切换中')
    setTimeout(() => {
      loading.close()
      // 获取图标数据
    }, 500)
  },
  methods: {
    handleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
      //! value就是当前被分配的所有的权限id
    },
    next () {
      if (this.stepActive === 3) {
        return
      }
      this.stepActive++
    },
    backStep () {
      if (this.stepActive === 0) {
        return
      }
      this.stepActive--
    },
    // 上传视频前对文件格式进行验证
    beforeUploadVideo (file) {
      // const isLt10M = file.size / 1024 / 1024 < 10
      // if (
      //   [
      //     'video/mp4',
      //     'video/ogg',
      //     'video/flv',
      //     'video/avi',
      //     'video/wmv',
      //     'video/rmvb'
      //   ].indexOf(file.type) == -1
      // ) {
      //   this.$message.error('请上传正确的视频格式')
      //   return false
      // }
      // if (!isLt10M) {
      //   this.$message.error('上传视频大小不能超过10MB哦!')
      //   return false
      // }
    },
    // 上传成功后显
    handleVideoSuccess (res, file) {
      console.log(file)
      // this.videoFlag = false
      // this.videoUploadPercent = 0
      // if (res.status === 200) {
      //   // this.videoForm.videoUploadId = res.data.uploadId
      //   this.videoSrc = res.data.uploadUrl
      // } else {
      //   this.$message.error('视频上传失败，请重新上传！')
      // }
    },
    // 点击上传完成的列表文件
    showVideo (file) {
      console.log(file)
    },
    // 上传失败
    uploadError (err, file, fileList) {
      console.log(err)
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
</style>
