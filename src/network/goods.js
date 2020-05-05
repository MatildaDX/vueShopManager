import {request} from './request'
import qs from 'querystring'

// 添加商品
export function addGoods(form) {
  return request({
    url: `goods`,
    method: 'post',
    data: qs.stringify(form)
  })
}

// 根据id删除商品
export function deleteGoods(gid) {
  return request({
    url: `goods/${gid}`,
    method: 'delete'
  })
}

// 添加标签参数
export function editParamsTag(aid, pid, name, sel, vals) {
  return request({
    url: `categories/${aid}/attributes/${pid}`,
    method: 'put',
    data: {
      attr_name: name,
      attr_sel: sel,
      attr_vals: vals
    }
  })
}

// 删除参数
export function deleteParams(aid, pid) {
  return request({
    url: `categories/${aid}/attributes/${pid}`,
    method: 'delete'
  })
}

// 根据id查询参数
export function findParams(aid, pid, sel) {
  return request({
    url: `categories/${aid}/attributes/${pid}`,
    data: {
      sel: sel
    }
  })
}

// 编辑参数
export function editParams(editForm) {
  const aid = editForm.cat_id
  const pid = editForm.attr_id
  const name = editForm.attr_name
  const sel = editForm.attr_sel
  const vals = ''
  return request({
    url: `categories/${aid}/attributes/${pid}`,
    method: 'put',
    data: {
      attr_name: name,
      attr_sel: sel,
      attr_vals: vals
    }
  })
}

// 添加 动态/静态 参数
export function addAttributes(aid, name, sel, vals){
  return request({
    url: `categories/${aid}/attributes`,
    method: 'post',
    data: {
      attr_name: name,
      attr_sel: sel,
      attr_vals: vals
    }
  })
}

// 查询参数列表
export function cateAttributes(aid, sel) {
  return request({
    url: `categories/${aid}/attributes`,
    params: {
      sel: sel
    }
  })
}

// 请求所有商品数据
export function goods(queryInfo) {
  return request({
    url: `goods?${qs.stringify(queryInfo)}`
  })
}

// 请求所有分类数据 参数可为空
export function categories(type, pagenum,pagesize) {
  return request({
    url: 'categories',
    params: {
      type, pagenum,pagesize
    }
  })
}
