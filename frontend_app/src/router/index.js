import Vue from 'vue'
import Router from 'vue-router'
import vueResource from 'vue-resource'
import VueLocalStorage from 'vue-localstorage'
import MultiLanguage from 'vue-multilanguage'

import Login from '@/components/login'
import Home from '@/components/home'
import User from '@/components/user'
import Movie from '@/components/video'
import NotFound from '@/components/404NotFound'

Vue.use(Router)
Vue.use(vueResource)
Vue.use(VueLocalStorage)
Vue.use(MultiLanguage, {
  default: 'en',
  en: {
    hi: 'Hello',
    welcome: 'Welcome, {name}',

    signup: 'Sign Up',
    email: 'Email',
    username: 'Username',
    first_name: 'First Name',
    last_name: 'Last Name',
    password: 'Password',
    msg_pswd: 'Your password needs to be at least 8 chars long. <br> With lower and upper cases and digits only.',
    confirm_password: 'Confirm password',
    btn_signup: 'Sign Me Up!',

    signin: 'Sign In',
    with: 'With the following :',
    or: 'Or here :',
    remember_me: 'Remember Me!',
    btn_signin: 'Sign Me In!'

  },
  fr: {
    hi: 'Bonjour',
    welcome: 'Bienvenue, {name}',

    signup: 'S\'inscrire',
    email: 'Email',
    username: 'Pseudo',
    first_name: 'Prénom',
    last_name: 'Nom',
    password: 'Mot de passe',
    msg_pswd: 'Votre mot de passe doit contenir au minimum 8 caractères. <br> Avec uniquement des minuscules, majuscules et chiffres.',
    confirm_password: 'Confirmer mot de passe',
    btn_signup: 'S\'inscrire!',

    signin: 'Se connecter',
    with: 'Avec :',
    or: 'Ou alors :',
    remember_me: 'Se souvenir de moi!',
    btn_signin: 'Se connecter!'
  },
})


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
      path: '/user/:username',
      name: 'user',
      component: User
    },
    {
      path: '/video/:which',
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
