// // 角色-权限--根据角色id查询角色接口
// import request from '@/plugin/axios'
//
// // 这里是get请求，后台没有做特殊处理，所以只能通过url拼接query的方式
// function searchPermisionByRole (data) {
//   return request({
//     url: `/roleAndPer/selectByRoleId?pageNum=${data.pageNum}&pageSize=${data.pageSize}0&roleId=${data.roleId}`,
//     method: 'get'
//   })
// }
//
// export { searchPermisionByRole }
