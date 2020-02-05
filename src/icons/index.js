import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
export const allIcons = req.keys().map(item => item.match(/\.\/(\S*)\.svg/)[1])
requireAll(req)
