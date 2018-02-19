<template>
  <div class="home">
    <h1>Home Page</h1>


    <div class="row">    
      <div class="col-xs-6 col-xs-offset-3">
        <div class="input-group">
          <div class="input-group-btn search-panel">
              <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                <span id="search_concept">Filter by</span> <span class="caret"></span>
              </button>
              <ul class="dropdown-menu" role="menu">
                <li><a href="#">Title</a></li>
                <li><a href="#">Genre</a></li>
                <li><a href="#">Oldest</a></li>
                <li><a href="#">Newest</a></li>
                <li><a href="#">Votes</a></li>
                <li class="divider"></li>
                <li><a href="#all">Anything</a></li>
              </ul>
          </div>
          <input type="hidden" name="search_param" value="all" id="search_param">         
          <input type="text" class="form-control" name="x" placeholder="Search term...">
          <span class="input-group-btn">
              <button class="btn btn-default" type="button"><span class="glyphicon glyphicon-search"></span></button>
          </span>
        </div>
      </div>
  </div>


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