<template>
  <div class="app-container"><h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select v-model=courseInfo.subjectParentId placeholder="请选择" @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>


      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss/upload'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元">元
        </el-input-number>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="savaOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import course from '@/api/edu/course'
  import subject from '@/api/edu/subject'
  import Tinymce from '@/components/Tinymce'
  import teacher from '@/api/edu/teacher'

  export default {
    components: { Tinymce },
    data() {
      return {
        saveBtnDisabled: false,
        courseInfo: {
          title: '',
          subjectParentId: '',
          subjectId: '',
          teacherId: '',
          lessonNum: 0,
          description: '',
          cover: 'https://www.gulixueyuan.com/files/default/2018/06-14/1709051b4c3c309882.jpg',
          price: 0
        },
        courseId: '',
        //封装所有讲师的数据
        teacherList: [],
        //所有一级分类数据
        subjectOneList: [],
        //所有二级分类数据
        subjectTwoList: [],
        BASE_API: process.env.BASE_API // 接口API地址
      }
    },
    created() {
      this.init()
    },
    watch: {
      $route(to, from) {
        // 对路由变化作出响应...
        this.init()
      }
    },
    methods: {
      init() {
        if (this.$route.params && this.$route.params.id) {
          this.courseId = this.$route.params.id
          this.getCourseInfoById()
          this.getAllTeacher()
        } else {
          this.courseInfo = {
            title: '',
            subjectParentId: '',
            subjectId: '',
            teacherId: '',
            lessonNum: 0,
            description: '',
            cover: 'https://www.gulixueyuan.com/files/default/2018/06-14/1709051b4c3c309882.jpg',
            price: 0
          }
          //初始化所有讲师
          this.getAllTeacher()
          //初始化一级分类
          this.getAllSubject()
        }
      },
      getCourseInfoById() {
        course.getCourseInfoById(this.courseId).then(response => {
          this.courseInfo = response.data.courseInfo
          console.log(this.courseInfo)
          subject.getAllSubject().then(response => {
            this.subjectOneList = response.data.list
            for (let i = 0; i < this.subjectOneList.length; i++) {
              //每个一级分类
              let oneSubject = this.subjectOneList[i]
              //判断所有一级分类id和点击一级分类id是否一样
              if (this.courseInfo.subjectParentId === oneSubject.id) {
                this.subjectTwoList = oneSubject.children
              }
            }
          })

        })
      },
      //上传成功回调方法
      handleAvatarSuccess(res, file) {
        this.courseInfo.cover = res.data.url
      },
      //上传之前方法
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },

      //添加更新课程信息
      savaOrUpdate() {
        if (this.$route.params && this.$route.params.id) {
          course.updateCourseInfo(this.courseInfo).then(response => {
            this.$message({
              type: 'success',
              message: '修改课程信息成功!'
            })
          })
          this.$router.push({ path: `/course/chapter/` + this.courseId })
        } else {
          course.addCourseInfo(this.courseInfo).then(response => {
            this.$message({
              type: 'success',
              message: '添加课程信息成功!'
            })
            this.$router.push({ path: `/course/chapter/` + response.data.courseId })
          })
        }

      },
      //查询所有的讲师
      getAllTeacher() {
        teacher.getListTeacher().then(response => {
          this.teacherList = response.data.items
        })
      },

      getAllSubject() {
        subject.getAllSubject().then(response => {
          this.subjectOneList = response.data.list
        })
      },
      //点击某个一级分类，出发change，显示对应的二级分类
      subjectLevelOneChanged(value) {
        this.courseInfo.subjectId = ''
        // alert(value)
        //value就是一级分类id值
        for (let i = 0; i < this.subjectOneList.length; i++) {
          //每个一级分类
          let oneSubject = this.subjectOneList[i]
          //判断所有一级分类id和点击一级分类id是否一样
          if (value === oneSubject.id) {
            this.subjectTwoList = oneSubject.children
          }
        }
      }
    }
  }
</script>

