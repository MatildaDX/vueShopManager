import {request} from './request'

export function postLogin(username, password) {
  return request({
    url: 'login',
    method: 'post',
    params: {
      username,
      password
    }
  })
}