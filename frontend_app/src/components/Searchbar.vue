<template>
<div class="search-bar">

	<TypeAhead
	  id="type-a-head"
      :src="search_url"
      :getResponse="getResponse"
      :onHit="onHit"
      :placeholder="looking_for"
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
import {searchUrl} from '@/config.js'

export default{
	name: 'Searchbar',
	components:{
		TypeAhead
	},
  computed: {
    looking_for()  {
     return this.translate('looking_for')
    }
  },
	data(){
		return{
      searchResponse: [],
			movieData: [],
      search_url: searchUrl
		}
	},
	methods: {
      getResponse: function (response) {
        console.log(response.data)
    		let n = response.data.results.length
    		if (n > 10){
    			n = 10
    		}
    		for (var i = 0; i < n; i++) {
          this.searchResponse[i] = response.data.results[i]['name'];
          this.movieData[i] = response.data.results[i]
        }
        return this.searchResponse
      },
      onHit: function (item, vue, index) {
        console.log(this.movieData)
        let n = this.movieData.length
        for (var i = 0; i < n; i++) {
          if (this.movieData[i]['name'] == item){
            localStorage.setItem('video-name', this.movieData[i]['name'])
            localStorage.setItem('video-link', this.movieData[i]['link'])
            localStorage.setItem('video-magnet', this.movieData[i]['magnet_link'])
            this.$router.push('/video/' + item)
          }
        }

        
      }
    }
}

</script>

<style scoped>
#type-a-head{
    width: 100%;
}
</style>