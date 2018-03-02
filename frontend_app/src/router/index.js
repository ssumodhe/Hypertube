import Vue from 'vue'
import Router from 'vue-router'
import vueResource from 'vue-resource'

import Login from '@/components/login'
import Home from '@/components/home'
import User from '@/components/user'
import Movie from '@/components/video'
import NotFound from '@/components/404NotFound'

Vue.use(Router)
Vue.use(vueResource)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      // beforeEnter: (to, from, next) => {
      //   console.log(to)
      //   console.log(from)
      //   console.log(next)
      //   next()
      // }
      // MiddleWare
      // beforeEnter: (to, from, next) => {
      //   // ...
      // }
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
    },
    {
      path: '/404',
      name: 'notFound',
      component: NotFound
    }
  ],
  mode: 'history'
  // to avoid # in url
})
