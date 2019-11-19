import Layout from '@/layout'

const developerTool = {
  path: '/iframe',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Iframe',
  meta: {
    title: '开发者工具',
    icon: 'link'
  },
  children: [
    {
      path: 'druid?src=http://www.baidu.com',
      name: 'Druid',
      component: () => import('@/views/iframe/index'),
      meta: {
        title: 'Druid',
        icon: 'link'
      }
    },
    {
      path: 'swagger?src=http://localhost:8080/dynamic/swagger-ui.html',
      component: () => import('@/views/iframe/index'),
      name: '接口文档',
      meta: {
        title: '接口文档',
        icon: 'link'
      }
    }
  ]
}

export default developerTool
