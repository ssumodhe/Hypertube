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
    welcome: 'Welcome, {name}.',
      // Login-signup
    signup: 'Sign Up',
    email: 'Email',
    username: 'Username',
    first_name: 'First Name',
    last_name: 'Last Name',
    password: 'Password',
    msg_pswd: 'Your password needs to be at least 8 chars long. <br> With lower and upper cases and digits only.',
    confirm_password: 'Confirm password',
    btn_signup: 'Sign Me Up!',
      // Login-signin
    signin: 'Sign In',
    with: 'With the following :',
    or: 'Or here :',
    remember_me: 'Remember Me!',
    btn_signin: 'Sign Me In!',
      // Video
    msg_ad: 'Ad : Your video will play after this ad.',
    msg_cmt: 'Add a comment... Share With Us :) ',
    btn_share: 'Share',
    prev_cmt: 'Previous comments',
    commented : ' commented ',
    no_cmt: 'No comments yet! Be the first to share ! ;)',
      // Home
    new: ' New',
    prev: 'Previous',
    next: 'Next',
    watch: ' Watch',
    all_we_got: 'That\'s all we\'ve got !',
      // Searchbar
    looking_for: 'Are you looking for something in particular ?',
      // App (NavBar)
    home: 'Home',
    profile: 'Profile',
    log_out: 'Log Out',
    
  },
  fr: {
    welcome: 'Bienvenue, {name}.',
      // Login-signup
    signup: 'S\'inscrire',
    email: 'Email',
    username: 'Pseudo',
    first_name: 'Prénom',
    last_name: 'Nom',
    password: 'Mot de passe',
    msg_pswd: 'Votre mot de passe doit contenir au minimum 8 caractères. <br> Avec uniquement des minuscules, majuscules et chiffres.',
    confirm_password: 'Confirmer mot de passe',
    btn_signup: 'S\'inscrire!',
      // Login-signin
    signin: 'Se connecter',
    with: 'Avec :',
    or: 'Ou alors :',
    remember_me: 'Se souvenir de moi!',
    btn_signin: 'Se connecter!',
      // Video
    msg_ad: 'Pub: Votre vidéo commencera après cette publicité.',
    msg_cmt: 'Partagez votre impression, ajoutez un commentaire :) ',
    btn_share: 'Partager',
    prev_cmt: 'Commentaires précédents',
    commented : ' a commenté ',
    no_cmt: 'Pas encore de commentaires! Soyez le premier à partager ! ;)',
      // Home
    new: ' Nouveau',
    prev: 'Précédent',
    next: 'Suivant',
    watch: ' Regarder',
    all_we_got: 'Voilà tout ce que nous ayons !',
      // Searchbar
    looking_for: 'Cherchez vous quelque chose ?',
      // App (NavBar)
    home: 'Accueil',
    profile: 'Compte',
    log_out: 'Déconnexion',


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
