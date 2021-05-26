import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import hotmoney from '@/views/hotmoney'
import test from '@/views/test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'hotmoney',
      component: hotmoney
    },
    // {
    //   path: '/',
    //   name: 'test',
    //   component: test
    // }
  ]
})
