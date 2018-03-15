<template>
<div class="search-bar">

	<TypeAhead
	  id="type-a-head"
      src="https://hypertubeapi.tpayet.com/search?query=:keyword"
      :getResponse="getResponse"
      :onHit="onHit"
      :placeholder="placeholder"
    ></TypeAhead>
<!-- 	<div class="row">    
      <div class="col-sm-12 col-md-6 col-md-offset-3">
        <div class="input-group ">
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
          <input type="text" class="form-control" name="x" placeholder="Search term..." :value="searchResponse">
          <span class="input-group-btn">
              <button class="btn btn-default" type="button"><span class="glyphicon glyphicon-search"></span></button>
          </span>
        </div>
      </div>
  </div> -->

</div>
</template>

<script>
import TypeAhead from 'vue2-typeahead'

export default{
	name: 'Searchbar',
	components:{
		TypeAhead
	},
	data(){
		return{
			searchResponse: [],
      placeholder: 'Are you looking for something in particular ?'
		}
	},
	methods: {
      getResponse: function (response) {
    		let n = response.data.results.length
    		if (n > 10){
    			n = 10
    		}
    		for (var i = 0; i < n; i++) {
          this.searchResponse[i] = response.data.results[i]['name'];
        }
        return this.searchResponse
      },
      onHit: function (item, vue, index) {
        this.$router.push('/video/' + item)
      }
    }
}

</script>

<style scoped>
#type-a-head{
    width: 100%;
}
</style>