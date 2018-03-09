// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

require('../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss')

Vue.config.productionTip = false

// MiddleWare
router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    next('/404');
  } 
  else if (to.name != "login" && to.name != "notFound" && !localStorage.getItem('token')){
    next('/login');
  }
  else {
    console.log("token : " + localStorage.getItem('token'))
    console.log("id : " + localStorage.getItem('id'))
    console.log("email : " + localStorage.getItem('email'))
    console.log("picture : " + localStorage.getItem('picture'))
    console.log("firstname : " + localStorage.getItem('firstname'))
    console.log("lastname : " + localStorage.getItem('lastname'))
    console.log("username : " + localStorage.getItem('username'))
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
