import {request} from './request'

// 基于时间统计的折线图
export function reports() {
  return request({
    url: 'reports/type/1'
  })
}
