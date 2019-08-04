import { asyncRoutes, constantRoutes } from '@/router'
import { getResources } from '@/api/resource'

/**
 * 给予路由表权限
 * @param roles
 * @param route
 * @returns {boolean}
 */
function filterAsyncRoutes(menu, route) {
  if (menu.path === '*' || menu.path === route.path) {
    return true
  }
}

/**
 * 通过后台获取的路由按递归筛选本地路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAndRenderingAsyncRoutes(routes, menus) {
  const res = []

  routes.forEach(route => {
    const tmpRoute = { ...route }
    menus.forEach(tempMenu => {
      if (filterAsyncRoutes(tempMenu, tmpRoute)) {
        tmpRoute.hidden = tempMenu.hidden
        tmpRoute.alwaysShow = tempMenu.alwaysShow
        tmpRoute.meta.title = tempMenu.meta.title
        tmpRoute.meta.icon = tempMenu.meta.icon
        tmpRoute.meta.noCache = tempMenu.meta.noCache
        tmpRoute.meta.affix = tempMenu.meta.affix
        tmpRoute.meta.breadcrumb = tempMenu.meta.breadcrumb
        tmpRoute.meta.roles = tempMenu.meta.roles
        if (tmpRoute.children && tempMenu.children) {
          tmpRoute.children = filterAndRenderingAsyncRoutes(tmpRoute.children, tempMenu.children)
        }
        res.push(tmpRoute)
      }
    })
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  getResources({ commit }) {
    return new Promise((resolve, reject) => {
      getResources().then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  generateRoutes({ commit }, menus) {
    return new Promise(async resolve => {
      const accessedRoutes = filterAndRenderingAsyncRoutes(asyncRoutes, menus)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
