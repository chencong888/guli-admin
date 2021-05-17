import request from '@/utils/request'

export default {
  //讲师列表（条件分页查询）
  getTeacherListPage(current, limit, teacherQuery) {
    return request({
      // url: '/serviceedu/edu/pageTeacherCondition/'+current+'/'+limit,
      url: `/serviceedu/teacher/pageTeacherCondition/${current}/${limit}`,
      method: 'post',
      //teacherQuery条件对象，后端使用RequestBody获取数据
      //data表示把对象转换json进行传送到接口里面
      data: teacherQuery
    })
  },
  getTeacherById(id) {
    return request({
      // url: '/serviceedu/edu/pageTeacherCondition/'+current+'/'+limit,
      url: `/serviceedu/teacher/getTeacher/${id}`,
      method: 'get',
    })
  },
  deleteTeacherById(id) {
    return request({
      // url: '/serviceedu/edu/pageTeacherCondition/'+current+'/'+limit,
      url: `/serviceedu/teacher/${id}`,
      method: 'delete'
    })
  },

  addTeacher(teacher) {
    return request({
      // url: '/serviceedu/edu/pageTeacherCondition/'+current+'/'+limit,
      url: `/serviceedu/teacher/addTeacher`,
      method: 'post',
      data: teacher
    })
  },
  updateTeacher(teacher) {
    return request({
      url: `/serviceedu/teacher/updateTeacher`,
      method: 'post',
      data: teacher
    })
  },
  //查询所有讲师
  getListTeacher() {
    return request({
      url: `/serviceedu/teacher/getAll`,
      method: 'get'
    })
  },
}



