import Vue from 'vue'
import Router from 'vue-router'
import vueResource from 'vue-resource'

import Login from '@/components/login'
import Home from '@/components/home'
import User from '@/components/user'
import Movie from '@/components/video'

Vue.use(Router)
Vue.use(vueResource)

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
      name: 'movie',
      component: Movie
    }
  ],
  mode: 'history'
  // to avoid # in url
})