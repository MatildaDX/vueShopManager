import { request } from './request'
import qs from 'querystring'

// 分配用户角色
export function setUserRole(userId, roleId) {
  return request({
    url: `users/${userId}/role`,
    method: 'put',
    data: {
      rid: roleId
    }
  })
}

// 根据id查询角色信息
export function findRoles(roleId) {
  return request({
    url: `roles/${roleId}`
  })
}

// 编辑角色
export function editRoles(editRoles) {
  return request({
    url: `roles/${editRoles.roleId}`,
    method: 'put',
    data: {
      roleName: editRoles.roleName,
      roleDesc: editRoles.roleDesc
    }
  })
}

// 删除指定角色
export function deleteRoles(roleId) {
  return request({
    url: `roles/${roleId}`,
    method: 'delete'
  })
}

// 添加角色
export function addRoles(roluse) {
  return request({
    url: 'roles',
    method: 'post',
    data: qs.stringify(roluse)
  })
}

// 查询所有权限
export function getRightsList(type) { 
  return request({
    url: `rights/${type}`
  })
} 

// 查询所有角色列表
export function getRoles() {
  return request({
    url: 'roles'
  })
}

// 删除指定角色的指定权限
export function deleteRolesRights(roleId, reghtsId) {
  return request({
    url: `roles/${roleId}/rights/${reghtsId}`,
    method: 'delete'
  })
}

// 分配权限
export function allotReghts(roleId, rids) {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids
    }
  })
}
