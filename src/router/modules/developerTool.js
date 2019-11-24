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
      path: 'druid',
      name: 'Druid',
      props: { redirect: 'http://localhost:8080/dynamic/druid' },
      component: () => import('@/views/iframe/index'),
      meta: {
        title: 'Druid',
        icon: 'link'
      }
    },
    {
      path: 'swagger',
      name: 'Swagger',
      props: { redirect: 'http://localhost:8080/dynamic/swagger-ui.html' },
      component: () => import('@/views/iframe/index'),
      meta: {
        title: 'Swagger',
        icon: 'link'
      }
    }
  ]
}

export default developerTool
