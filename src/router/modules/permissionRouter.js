/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const permissionRouter = {
  path: '/permission',
  component: Layout,
  redirect: '/permission/page',
  alwaysShow: true, // will always show the root menu
  name: 'Permission',
  meta: {
    title: '权限控制',
    icon: 'lock'
  },
  children: [
    {
      path: 'page',
      component: () => import('@/views/permission/page'),
      name: 'PagePermission',
      meta: {
        title: '角色切换'
      }
    },
    {
      path: 'directive',
      component: () => import('@/views/permission/directive'),
      name: 'DirectivePermission',
      meta: {
        title: '权限指令'
      }
    },
    {
      path: 'route',
      component: () => import('@/views/permission/route'),
      name: 'RoutePermission',
      meta: {
        title: '菜单管理'
      }
    },
    {
      path: 'resource',
      component: () => import('@/views/permission/resource'),
      name: 'ResourcePermission',
      meta: {
        title: '资源管理'
      }
    },
    {
      path: 'role',
      component: () => import('@/views/permission/role'),
      name: 'RolePermission',
      meta: {
        title: '角色权限'
      }
    }
  ]
}

export default permissionRouter
