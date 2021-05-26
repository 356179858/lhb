import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import hotmoney from '@/views/hotmoney'
import test from '@/views/test'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect:{name:"index"}
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/hotmoney',
      name: 'hotmoney',
      component: hotmoney
    }
  ]
})
