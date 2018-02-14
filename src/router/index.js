import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login'
import Home from '@/components/home'
import User from '@/components/user'
import Video from '@/components/video'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
	{
      path: '/video',
      name: 'video',
      component: Video
    }
  ]
})
