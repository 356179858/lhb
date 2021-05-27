import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import hotmoney from '@/views/hotmoney'
import hotmoney_detail from '@/views/hotmoney_detail'
import unscramble from '@/views/unscramble'
import test from '@/views/test'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      redirect: {
        name: "hotmoney_detail",
      }
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/hotmoney',
      name: 'hotmoney',
      component: hotmoney,
      // children: [{
      //     path: 'hotmoney_detail',
      //     name: 'hotmoney_detail',
      //     component: hotmoney_detail
      //   }
      // ]
    },
    {
      path: '/hotmoney_detail',
      name: 'hotmoney_detail',
      component: hotmoney_detail,
    },
    {
      path: '/unscramble',
      name: 'unscramble',
      component: unscramble
    },

  ]
})
