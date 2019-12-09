import Layout from '@/layout'

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
function filterAndRenderingAsyncRoutes(routes, menus) {
  const res = []

  routes.forEach(route => {
    const tmpRoute = { ...route }
    menus.forEach(tmpMenu => {
      if (filterAsyncRoutes(tmpMenu, tmpRoute)) {
        tmpRoute.hidden = tmpMenu.hidden
        tmpRoute.alwaysShow = tmpMenu.alwaysShow
        tmpRoute.meta.title = tmpMenu.meta.title
        tmpRoute.meta.icon = tmpMenu.meta.icon
        tmpRoute.meta.noCache = tmpMenu.meta.noCache
        tmpRoute.meta.affix = tmpMenu.meta.affix
        tmpRoute.meta.breadcrumb = tmpMenu.meta.breadcrumb
        tmpRoute.meta.roles = tmpMenu.meta.roles
        if (tmpRoute.children && tmpMenu.children) {
          tmpRoute.children = filterAndRenderingAsyncRoutes(tmpRoute.children, tmpMenu.children)
        }
        res.push(tmpRoute)
      }
    })
  })

  return res
}

const defaultRoute = {
  path: '',
  component: '',
  redirect: '',
  name: '',
  meta: {},
  children: []
}

/**
 * 将路由全权交给后台管理
 * @param menus
 * @returns {[]}
 */
function generateAsyncRoutes(menus) {
  const res = []

  menus.forEach(tmpMenu => {
    const tmpRoute = Object.assign({}, defaultRoute)
    tmpRoute.path = tmpMenu.path
    if (tmpMenu.component === 'Layout') {
      tmpRoute.component = Layout
    } else {
      tmpRoute.component = () => import(`@/views${tmpMenu.component}`)
    }
    tmpRoute.redirect = tmpMenu.redirect
    tmpRoute.name = tmpMenu.name
    tmpRoute.hidden = tmpMenu.hidden
    tmpRoute.alwaysShow = tmpMenu.alwaysShow
    tmpRoute.meta = tmpMenu.meta
    if (tmpMenu.children && tmpMenu.children.length) {
      tmpRoute.children = generateAsyncRoutes(tmpMenu.children)
    }
    res.push(tmpRoute)
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
      // const accessedRoutes = filterAndRenderingAsyncRoutes(asyncRoutes, menus)
      const accessedRoutes = generateAsyncRoutes(menus)
      console.log(accessedRoutes)
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
