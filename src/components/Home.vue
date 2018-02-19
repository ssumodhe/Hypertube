<template>
  <div class="home">
    <h1>Home Page</h1>





    {{note}}

    <div id="list_movies" v-for="lib in library">
      <div class="list-group col-md-6 col-md-offset-3" >
        <router-link to="/video" class="list-group-item list-group-item-action flex-column align-items-start" >
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">{{lib.id}}</h5>
            <small>3 days ago</small>
          </div>
          <p class="mb-1">{{lib.title}}</p>
          <small>Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</small>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  name: 'home',
  data(){
    return {
      note: "This is the Home page Where all videos will be displayed",
      library : []
    }
  },
  created: function(){
    this.$http.get('https://jsonplaceholder.typicode.com/albums')
      .then(function(response){
        this.library = response.data;
      })
  }
}
</script>