import request from '@/utils/request'

export function getAllRouteTree() {
  return request({
    url: '/route/tree',
    method: 'get'
  })
}

export function getRouteById(id) {
  return request({
    url: `/route/${id}`,
    method: 'get'
  })
}

export function addRoute(data) {
  return request({
    url: '/route',
    method: 'post',
    data
  })
}

export function updateRoute(data) {
  return request({
    url: '/route',
    method: 'put',
    data
  })
}

export function deleteRoute(id) {
  return request({
    url: `/route/${id}`,
    method: 'delete'
  })
}

