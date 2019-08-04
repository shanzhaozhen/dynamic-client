import request from '@/utils/request'

export function getResources() {
  return request({
    url: '/resource/list',
    method: 'get'
  })
}
