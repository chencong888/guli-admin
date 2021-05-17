import request from '@/utils/request'

export default {
  //获取所有课程列表
  getAllSubject() {
    return request({
      // url: '/serviceedu/edu/pageTeacherCondition/'+current+'/'+limit,
      url: `/serviceedu/subject/getAllSubject`,
      method: 'get'
    })
  }
}



