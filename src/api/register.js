import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

export function checkUsername(username) {
  return request({
    url: `/register/${username}`,
    method: 'get'
  })
}

