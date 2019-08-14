import request from '@/utils/request'

export function getAllResourceTree() {
  return request({
    url: '/resource/tree',
    method: 'get'
  })
}

export function getResourceById(id) {
  return request({
    url: `/resource/${id}`,
    method: 'get'
  })
}

export function addResource(data) {
  return request({
    url: '/resource',
    method: 'post',
    data
  })
}

export function updateResource(data) {
  return request({
    url: '/resource',
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return request({
    url: `/resource/${id}`,
    method: 'delete'
  })
}

