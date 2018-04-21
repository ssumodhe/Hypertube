<template>
<div class="search-bar">

	<TypeAhead
	  id="type-a-head"
      :src="search_url"
      :getResponse="getResponse"
      :onHit="onHit"
      :placeholder="looking_for"
    ></TypeAhead>

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
    		let n = response.data.length
    		if (n > 10){
    			n = 10
    		}
        if (n == 0){
          this.searchResponse = response.data
        }
        this.movieData = []
    		for (var i = 0; i < n; i++) {
          this.searchResponse[i] = response.data[i]['name'];
          this.movieData[i] = response.data[i]
        }
        return this.searchResponse
      },
      onHit: function (item, vue, index) {
        let n = this.movieData.length
        for (var i = 0; i < n; i++) {
          if (this.movieData[i]['name'] == item){
            localStorage.setItem('video-name', this.movieData[i]['name'])
            localStorage.setItem('video-link', this.movieData[i]['link'])
            localStorage.setItem('video-magnet', this.movieData[i]['magnet_link'])
            localStorage.setItem('video-db', false)
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