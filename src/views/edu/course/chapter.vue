<template>
  <div class="app-container"><h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-button type="text" @click="openDialog">添加章节</el-button>

    <el-dialog title="添加章节" :visible.sync="dialogFormVisible">
      <el-form :model="chapter">
        <el-form-item label="章节标题" :label-width="formLabelWidth">
          <el-input v-model="chapter.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="章节排序" :label-width="formLabelWidth">
          <el-input-number v-model="chapter.sort" controls-position="right" :min="0" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <ul class="chanpterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
               <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
               <el-button style="" type="text" @click="openEditChatper(chapter.id)">编辑</el-button>
               <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
           </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
               <el-button style="" type="text" @click="openEditVideo(video.id)">编辑</el-button>
               <el-button type="text" @click="deleteVideoById(video.id)">删除</el-button>
           </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-form label-width="120px">
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-osition="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO --></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import chapter from '@/api/edu/chapter'
  import video from '@/api/edu/video'

  export default {
    data() {
      return {
        saveBtnDisabled: false,
        chapterVideoList: [],
        courseId: '',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        chapter: {
          title: '',
          sort: 0
        },

        saveVideoBtnDisabled: false, // 课时按钮是否禁用
        dialogVideoFormVisible: false, // 是否显示课时表单
        chapterId: '', // 课时所在的章节id
        video: {// 课时对象
          title: '',
          sort: 0,
          isFree: 0,
          videoSourceId: ''
        }
      }

    },
    created() {
      if (this.$route.params && this.$route.params.id) {
        this.getChapterVideoByCourseId()
        this.courseId = this.$route.params.id
      }
    },
    methods: {
      //#######################小节方法######################################
      openEditVideo(videoId) {
        this.dialogVideoFormVisible = true
        video.getVideoById(videoId).then(response => {
          this.video = response.data.video
        })
      },

      openVideo(chapterId) {
        this.dialogVideoFormVisible = true
        this.video = {
          title: '',
          sort: 0,
          free: 0,
          videoSourceId: ''
        }
        this.video.chapterId = chapterId
      },
      deleteVideoById(id) {
        this.$confirm('此操作将删除此小节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          video.deleteVideoById(id)
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              //3.刷新页面
              this.getChapterVideoByCourseId()
            })
        })

      },
      addVideo() {
        this.video.courseId = this.courseId
        video.addVideo(this.video).then(response => {
          this.dialogVideoFormVisible = false
          //2.提示
          this.$message({
            type: 'success',
            message: '添加小节成功!'
          })
          //3.刷新页面
          this.getChapterVideoByCourseId()
        })
      },
      updateVideo(){
        this.video.courseId = this.courseId
        video.updateVideo(this.video).then(response => {
          this.dialogVideoFormVisible = false
          //2.提示
          this.$message({
            type: 'success',
            message: '修改小节成功!'
          })
          //3.刷新页面
          this.getChapterVideoByCourseId()
        })
      },

      saveOrUpdateVideo() {
        if (!this.video.id) {
          this.addVideo()
        } else {
          this.updateVideo()
        }
      },

      //#######################章节方法######################################
      openEditChatper(chapterId) {
        chapter.getChapterById(chapterId).then(response => {
          this.dialogFormVisible = true
          this.chapter = response.data.chapter
        })
      },

      openDialog() {
        this.dialogFormVisible = true
        this.chapter = {
          title: '',
          sort: 0
        }
      },
      saveOrUpdate() {
        if (!this.chapter.id) {
          this.addChapter()
        } else {
          this.updateChapter()
        }
      },
      addChapter() {
        this.chapter.courseId = this.courseId
        chapter.addChapter(this.chapter).then(response => {
          //1.关闭弹窗
          this.dialogFormVisible = false
          //2.提示
          this.$message({
            type: 'success',
            message: '添加章节成功!'
          })
          //3.刷新页面
          this.getChapterVideoByCourseId()
        })
      },
      updateChapter() {
        this.chapter.courseId = this.courseId
        chapter.updateChapter(this.chapter).then(response => {
          //1.关闭弹窗
          this.dialogFormVisible = false
          //2.提示
          this.$message({
            type: 'success',
            message: '修改章节成功!'
          })
          //3.刷新页面
          this.getChapterVideoByCourseId()
        })
      },
      removeChapter(chapterId) {
        this.$confirm('此操作将删除此章节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          chapter.deleteChapterById(chapterId)
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              //3.刷新页面
              this.getChapterVideoByCourseId()
            })
        })
      },
      getChapterVideoByCourseId() {
        chapter.getListChapter(this.$route.params.id).then(response => {
          this.chapterVideoList = response.data.allChapterVideo
        })
      },
      previous() {
        this.$router.push({ path: `/course/info/` + this.courseId })
      },
      next() {
        this.$router.push({ path: `/course/publish/` + this.courseId })
      }
    }
  }
</script>
<style scoped>
  .chanpterList {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .chanpterList li {
    position: relative;
  }

  .chanpterList p {
    /*float: left;*/
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
  }

  .chanpterList .acts {
    float: right;
    font-size: 14px;
  }

  .videoList {
    padding-left: 50px;
  }

  .videoList p {
    /*float: left;*/
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
  }
</style>
