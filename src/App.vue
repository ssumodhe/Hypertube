<template>

  <div id="app">

    <div class="container">
      <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="navbar-header">
          <router-link to="/" class="navbar-brand">HyperTube</router-link>
        </div>

        <ul class="nav navbar-nav">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/user">Profile</router-link></li>
          <li><router-link to="/video">Videos</router-link></li>
        </ul>

        <ul class="nav navbar-nav navbar-right nav-login">
          <li role="separator" class="divider"></li>
          <li><router-link to="/login">Connexion</router-link></li>
        </ul>
      </nav>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
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
}
router-view {
  margin-top: 20px;
}
</style>

