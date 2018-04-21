<template>
  <div class="results">
    <div class="row">
    <div>
      <button  id="homeBtn"><router-link to="/">&larr; Go back Home!</router-link></button>
    </div>

    <div class="col-md-11 col-md-offset-1">
    <div class="card col-md-3" style="min-height: 350px; border: 1px solid gainsboro; border-radius: 15px; padding-top: 20px; margin: auto 10px 10px auto;" v-for="lib in displayMovies">
      <img v-if="lib.poster" class="card-img-top" :src="lib.poster" width="40%" max-height="40%">
      <img v-else class="card-img-top" src="/static/img/video-icon.png" width="40%" alt="Card image cap">
      <hr>
      <div class="card-body">
        
        <h5 class="card-title" style="display: inline-block;">
          {{lib.title}}
        </h5>
        
        <div style="width:100%; max-height: 70px; overflow: hidden;">
        <p v-if="lib.description" class="card-text">{{lib.description}}</p>
        <p v-else class="card-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
        </div>
        <div>
          <button @click="setAndSend(lib.id, lib.token, lib.title)" class="btn btn-default glyphicon glyphicon-film" style="margin-bottom: 5px;"><span v-lang.watch></span></button>
        </div>
      </div>
    </div>
    </div>
    </div>

  </div>
</template>

<script>
import {videoUrl} from '@/config.js'

export default{
  name: 'results',
  data(){
    return {
      allMovies: [],
      displayMovies: [],
      movieGenre: [],
    }
  },
  created: function(){
    axios({
      method: 'get',
      url: videoUrl,
    })
    .then( (response) => {
      this.allMovies = response.data
      this.setGenre(response.data)
      let item = this.getElem(this.$route.params.param)
      if (item == 'genre')
        this.displayGenre()
      if (item == 'title')
        this.displayTitle(this.$route.params.param)
      if (item == 'year')
        this.displayYear()
      if (item == 'rating')
        this.displayRating() 
    })
    .catch( (error) => {
      console.log(error)
    });
  },
  methods:{
    displayGenre: function(){
      let getAll = []
      for(let i = 0; i < this.allMovies.length; i++){
        let objGenre = JSON.parse(this.allMovies[i].genre)
        for(let j = 0; j < objGenre.length; j++){
          if(objGenre[j].trim().toLowerCase() == this.$route.params.param){
            getAll.push(this.allMovies[i])
          }
        }
      }
      this.displayMovies = getAll
      getAll = []
    },  
    displayRating: function(){
      let theRate = parseFloat(this.$route.params.param)
      let getRate = []
      for (let i = 0; i < this.allMovies.length; i++){
        if(parseFloat(this.allMovies[i]['rating']) <= theRate)
          getRate.push(this.allMovies[i])
      }
      let getAll = getRate.sort(function(a, b) {
          var x = parseFloat(a['rating']); var y = parseFloat(b['rating']);
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
      getRate = []
      this.displayMovies = getAll.reverse()
      getAll = []
    },
    displayTitle: function(item){
      let getAll = this.allMovies.sort(function(a, b) {
         var x = a['title'].toLowerCase(); var y = b['title'].toLowerCase();
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
          });
      if(item == 'Z')
        getAll.reverse()
      this.displayMovies = getAll
      getAll = []
    },
    displayYear: function(){
      let theYear = this.$route.params.param
      if (theYear == 'now')
        theYear = '2018'
      theYear = parseInt(theYear)
      let getYear = []
      for (let i = 0; i < this.allMovies.length; i++){
        if(parseInt(this.allMovies[i]['year']) <= theYear)
          getYear.push(this.allMovies[i])
      }
      let getAll = getYear.sort(function(a, b) {
          var x = parseInt(a['year']); var y = parseInt(b['year']);
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
      getYear = []
      this.displayMovies = getAll
      getAll = []
    },
    getElem: function(elem){
      for(let i = 0; i < this.movieGenre.length; i++){
        if(elem == this.movieGenre[i]){
          return 'genre'
        }
      }
      if(elem == 'A' || elem == 'Z')
        return 'title'
      if(elem == '1970' || elem == '1990' || elem == '2010' || elem == 'now')
        return 'year'
      if(elem == '5' || elem == '7' || elem == '10')
        return 'rating'
      else
        this.$router.push('/')
    },
    setGenre: function(data){
      let tmp = []
      for (let i = 0; i < data.length; i++){
        let objGenre = JSON.parse(data[i].genre)
        for (let j = 0; j < objGenre.length; j++){
          if (this.movieGenre.length == '0'){
            this.movieGenre[0] = objGenre[0].trim().toLowerCase()
          }
          for (let k = 0; k < this.movieGenre.length; k++){
            if (objGenre[j].trim().toLowerCase() == this.movieGenre[k]){
              break;
            }
            if (objGenre[j].trim().toLowerCase() != this.movieGenre[k] && k == (this.movieGenre.length - 1)){
              tmp.push(objGenre[j].trim().toLowerCase())
            }
          }
          this.movieGenre = this.movieGenre.concat(tmp)
          tmp = []
        }
      }
      let alpha = []
      for (let i = 0; i < this.movieGenre.length; i++){
        if (this.movieGenre[i].match(/^[a-zA-Z]+$/))
          alpha.push(this.movieGenre[i])
      }
      this.movieGenre = alpha.sort()
    },
    setAndSend: function(id, token, name){
      let link = "/video/" + token
      localStorage.setItem('video-id', id)
      localStorage.setItem('video-token', token)
      localStorage.setItem('video-db', true)
      localStorage.setItem('video-name', name)
      this.$router.push(link)
    },
  }
}
</script>

<style scoped>
.results{
  position: relative;
}
#homeBtn{
  border: 1px solid black;
  background-color: #777777;
  border-radius: 5px;
  color: white;
  margin-bottom: 20px;
  padding: 5px 5px 5px 5px;
}
a {
  color: white;
  text-decoration: none
}
footer{
  bottom: 0px;
}
</style>