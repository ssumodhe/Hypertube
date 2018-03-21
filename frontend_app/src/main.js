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
  else if (localStorage.getItem('token') && to.name == "login"){
    next(from.path)
  }
  else {
    // console.log(router)
    // console.log(router.options.routes)
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
