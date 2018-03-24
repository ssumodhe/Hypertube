<template>

  <div id="app">

    <div class="container" v-if="loggedIn">
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
              <li data-toggle="collapse" data-target="#myNavbar"><router-link to="/"><span v-lang.home></span></router-link></li>
              <li data-toggle="collapse" data-target="#myNavbar"><router-link :to="'/user/' + username"><span v-lang.profile></span></router-link></li>
              <li data-toggle="collapse" data-target="#myNavbar"><router-link :to="'/video/' + loggedIn">Videos</router-link></li>
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
               <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown"><i :class="flag"></i><span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li @click="switchLang('en')"><a href="#"><i class="em em-gb"></i> English</a></li>
                  <li @click="switchLang('fr')"><a href="#"><i class="em em-fr"></i> Français</a></li>
                  <li @click="switchLang('it')"><a href="#"><i class="em em-it"></i> Italiano</a></li>
                </ul>
              </li>
              <li>
                <button id="deco_button" v-on:click="logOut"><span  class="glyphicon glyphicon-log-out" style="color:white" :alt="log_out" :title="log_out"></span></button>    
        <!--          <router-link to="/login" id="deco_button"><span v-on:click="logOut" class="glyphicon glyphicon-log-out" style="color:white" alt="Deconnexion" title="Deconnexion"></span></router-link> -->
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </div>
    <div v-if="!loggedIn">
      <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>                        
            </button>
            <div class="navbar-header">
              <div class="navbar-brand">HyperTube</div>
            </div>
          </div>
          <div class="collapse navbar-collapse" id="myNavbar">
            <ul class="nav navbar-nav navbar-right">
                <li role="separator" class="divider"></li>
                <li>
                  <button class="lang-flag" v-if="this.language == 'fr'" @click="switchLang"><i class="em em-fr"></i></button>    
                  <button class="lang-flag" v-if="this.language == 'en'" @click="switchLang"><i class="em em-gb"></i></button>
                </li>
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
  computed:{
    log_out()  {
     return this.translate('log_out')
    },
    flag(){
      if(this.language == 'fr')
        return 'em em-fr'
      else if(this.language == 'it')
        return 'em em-it'
      else
        return 'em em-gb'
    }
  },
  data(){
    return{
      loggedIn: localStorage.getItem('token'),
      username: localStorage.getItem('username'),
    }
  },
  updated: function () {
  this.$nextTick(function () {
    this.loggedIn = localStorage.getItem('token')
    this.username = localStorage.getItem('username')

  })
  },
  methods: {
    logOut: function(){
      let temp = localStorage.getItem('vue-lang')
      localStorage.clear();
      localStorage.setItem('vue-lang', temp)
      this.$router.push('/login')
    },
    switchLang: function(lang){
      if(lang == 'fr'){
        this.language = 'fr'
      }else if(lang == 'it'){
        this.language = 'it'
      }
      else{
        this.language = 'en'
      }
    }
  }
}
</script>

<style scoped>
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
#deco_button{
  text-align: right;
  border: none;
  background-color: #222222;
  margin: 40% 10px auto auto;
}
@media (max-width:900px) {

  #deco_button { 
    text-align: center;
    margin: auto auto auto auto;    
    }

}
img {
  width: 5%;
  margin-top: 0;
}
.navbar{
  background-color: #222222;
  z-index: 2000;
}
@media (max-width:900px) {

  .lang-flag { 
    text-align: center;
    margin: auto auto 2% auto;    
    }

}
</style>

