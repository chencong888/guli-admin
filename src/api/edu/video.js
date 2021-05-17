import request from '@/utils/request'

export default {
  //讲师列表（条件分页查询）
  addVideo(video) {
    return request({
      url: `/serviceedu/video/addvideo`,
      method: 'post',
      data: video
    })
  },
  deleteVideoById(id) {
    return request({
      url: `/serviceedu/video/deleteVideoById/${id}`,
      method: 'get'
    })
  },
  getVideoById(id){
    return request({
      url: `/serviceedu/video/getVideoById/${id}`,
      method: 'get'
    })
  },
  updateVideo(video) {
    return request({
      url: `/serviceedu/video/updateVideo`,
      method: 'post',
      data: video
    })
  },
}
