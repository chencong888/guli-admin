import request from '@/utils/request'

export default {
  getListChapter(courseId) {
    return request({
      url: `/serviceedu/chapter/getChapterVideo/${courseId}`,
      method: 'get'
    })
  },
  addChapter(chapter) {
    return request({
      url: `/serviceedu/chapter/addChapter/`,
      method: 'post',
      data: chapter
    })
  },

  getChapterById(chapterId) {
    return request({
      url: `/serviceedu/chapter/getChapter/${chapterId}`,
      method: 'get'
    })
  },

  updateChapter(chapter) {
    return request({
      url: `/serviceedu/chapter/updateChapter`,
      method: 'post',
      data: chapter
    })
  },

  deleteChapterById(chapterId) {
    return request({
      url: `/serviceedu/chapter/deleteChapterById/${chapterId}`,
      method: 'get'
    })
  }

}



