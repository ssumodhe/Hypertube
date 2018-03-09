<template>

  <div id="app">

    <div class="container">
      <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>                        
            </button>
            <div class="navbar-header">
              <router-link to="/" class="navbar-brand">HyperTube</router-link>
            </div>
          </div>
          <div class="collapse navbar-collapse" id="myNavbar">
            <ul class="nav navbar-nav">
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/user">Profile</router-link></li>
              <li><router-link to="/video">Videos</router-link></li>
              <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown" href="#">Page 1 <span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li><a href="#">Page 1-1</a></li>
                  <li><a href="#">Page 1-2</a></li>
                  <li><a href="#">Page 1-3</a></li>
                </ul>
              </li>
            </ul>

            <ul class="nav navbar-nav navbar-right">
              <li role="separator" class="divider"></li>
              <li>
                <router-link v-if="loggedIn" to="/login"><img width="8%" v-on:click="logOut" src="static/img/deco_button.png" title="Deconnexion"></router-link>
                <router-link v-else to="/login">Connexion</router-link>
              </li>

              <!-- <li v-if="loggedIn == null"><router-link to="/login">Connexion</router-link></li>
              <li v-else><img width="8%" v-on:click="logOut" src="static/img/deco_button.png" title="Deconnexion"></li> -->
            </ul>
          </div>
        </div>
      </nav>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return{
      loggedIn: localStorage.getItem('token')
    }
  },
  updated: function () {
  this.$nextTick(function () {
    this.loggedIn = localStorage.getItem('token')
  })
  },
  methods: {
    logOut: function(){
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10%;
  margin-bottom: 10%;
  width: 100%;
}
router-view {
  margin-top: 20px;
}
#connexion_button{
  padding-right: 20px;
}
</style>

