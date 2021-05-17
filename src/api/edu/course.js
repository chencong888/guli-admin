import request from '@/utils/request'

export default {
  //添加课程信息
  addCourseInfo(courseInfo) {
    return request({
      url: `/serviceedu/course/addCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },

  //根据课程id查询课程基本信息
  getCourseInfoById(id) {
    return request({
      url: `/serviceedu/course/getCourseInfoById/${id}`,
      method: 'get'
    })
  },

  updateCourseInfo(courseInfo) {
    return request({
      url: `/serviceedu/course/updateCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },

  getCoursePublishInfo(id) {
    return request({
      url: `/serviceedu/course/getCoursePublishVoInfo/${id}`,
      method: 'get'
    })
  },

  updateCourseStatus(id) {
    return request({
      url: `/serviceedu/course/updateCourseStatus/${id}`,
      method: 'get'
    })
  },

  getPageList(page, limit, searchObj) {
    return request({
      url: `/serviceedu/course/getPageList/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  deleteCourse(id){
    return request({
      url: `/serviceedu/course/deleteCourseById/${id}`,
      method: 'delete',
    })
  }
}



