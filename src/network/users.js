import {request} from './request'
import qs, { parse } from 'querystring'

// 查询用户信息
export function getUsers(queryInfo) {
  return request({
    url: `users?${qs.stringify(queryInfo)}`,
  })
}

// 修改用户状态
export function putUserState(userInfo) {
  const uid = userInfo.id
  const state = userInfo.mg_state
  return request({
    url: `users/${uid}/state/${state}`,
    method: 'put',
  })
}

// 添加用户
export function addUser(userList) {
  return request({
    url: `users`,
    method: 'post',
    data: qs.stringify(userList)
  })
}

// 查询指定用户
export function findUser(id) {
  return request({
    url: `users/${id}`
  })
}

// 修改用户信息
export function editUser(editForm) {
  const id = editForm.id
  const email = editForm.email
  const mobile = editForm.mobile
  return request({
    url: `users/${id}`,
    method: 'put',
    // 和 params 区别: 一个是?后面拼接数据, 一个是将数据直接拼接到路径后面
    data: {
      email, mobile
    }
  })
}

// 删除多个用户
export function deleteUser(id) {
  return request({
    url: `users/${id}`,
    method: 'delete'
  })
}
