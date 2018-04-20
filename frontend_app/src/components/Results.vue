<template>
  <div class="results">
    <div id="moviesCards" class="col-md-9">
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
    getElem: function(elem){
      for(let i = 0; i < this.movieGenre.length; i++){
        if(elem == this.movieGenre[i]){
          return 'genre'
        }
      }

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
</style>