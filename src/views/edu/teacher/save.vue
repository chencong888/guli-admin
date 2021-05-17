<template>
  <div class="dashboard-container">
    讲师添加
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min='0'/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
          数据类型一定要和取出的json中的一致，否则没法回填
          因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>
        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss/upload'"
          field="file"
          @close="close" @crop-upload-success="cropSuccess"/>
      </el-form-item>


      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary"
                   @click="saveOrUpdate">保存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import teacherApi from "@/api/edu/teacher";
  import ImageCropper from '@/components/ImageCropper' //引入组件
  import PanThumb from '@/components/PanThumb'

  export default {
    components: {ImageCropper, PanThumb},//声明组件
    data() {
      return {
        teacher: {
          name: '',
          sort: '',
          level: 1,
          career: '',
          intro: '',
          avatar: '',
        },
        //保存按钮是否禁用
        saveBtnDisabled: false,
        //上传弹框是否显示
        imagecropperShow: false,
        //上传组件key值
        imagecropperKey: 0,
        //获取dev.env.js里面的BASE_API值
        BASE_API: process.env.BASE_API
      }
    },
    watch: {
      $route(to, from) {
        // 对路由变化作出响应...
        this.init()
      }
    },
    created() {
      console.log('created')
      this.init()
    },
    methods: {
      init() {
        //判断uri路径中是否含有id，若含有id则是更新，不含则是新增
        if (this.$route.params && this.$route.params.id) {
          const id = this.$route.params.id
          console.log("id: " + id)
          this.getTeacherInfo(id)
        } else {
          //先点击编辑，然后再点击添加讲师，发现添加讲师里面有之前编辑的回显数据
          //多个路由跳转到同一个页面，再页面中created方法只会执行第一次，后面再进行跳转不会执行
          this.teacher = {}
        }
      },
      getTeacherInfo(id) {
        teacherApi.getTeacherById(id).then(response => {
          this.teacher = response.data.teacher
        })
      },
      saveOrUpdate() {
        if (!this.teacher.id) {
          this.saveTeacher()
        } else {
          this.updateTeacherInfo()
        }
      },
      saveTeacher() {
        teacherApi.addTeacher(this.teacher).then(response => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.$router.push({path: '/edu/table'})
        })
      },
      updateTeacherInfo() {
        teacherApi.updateTeacher(this.teacher).then(repsonse => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.$router.push({path: '/edu/table'})
        })
      },
      //关闭上传弹窗的方法
      close() {
        this.imagecropperShow = false
        //上传组件初始化
        this.imagecropperKey = this.imagecropperKey+1
      },
      //上传成功的方法
      cropSuccess(data) {
        this.imagecropperShow = false
        //上传之后接口返回图片地址
        this.teacher.avatar = data.url
        //上传组件初始化，解决更新图像点击一次不保存再点击一次更新图像显示上传成功问题
        this.imagecropperKey = this.imagecropperKey+1
      }
    }
  }
</script>
