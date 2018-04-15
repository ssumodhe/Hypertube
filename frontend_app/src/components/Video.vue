<template>
  <div class="movie">
    <span id="title-video">{{videoName}}</span>
    <br>
    <br>
    <br>

    <!-- Video PART -->
    <div>
      <span v-if="advert" id="advertisement"><strong><span v-lang.msg_ad></span></strong></span>
      <video ref="videoPlaying" :src="movieSource"  autoplay="autoplay" preload="metadata" loop controls>
        <track kind="subtitles" :src="subEn" srclang="en" label="English" default="">
        <track kind="subtitles" :src="subFr" srclang="fr" label="French">
      </video>

    </div>


    <!-- Infos PART -->
    <div class="infos col-md-offset-1">
      <div id="info-left" class="col-md-3"><img :src="poster" width="100%"></div>
      <div id="info-mid" class="col-md-4">
        <span><span v-lang.directed_by></span><strong>{{director}}</strong></span><br>
        <span><span v-lang.runtime></span><strong>{{runtime}}</strong></span><br>
        <span><span v-lang.rating></span><strong>{{rating}}</strong></span>
      </div>
      <div id="info-right" class="col-md-4"><span><span v-lang.description></span><strong>{{description}}</strong></span></div>
    </div>
    
    <!-- Write Comments PART -->
    <div class="comments">
      <div id="comment-area">
        <textarea ref="commentTxtArea" @keydown="isEnter" @keydown.enter.prevent class="comment" cols="60" rows="6" :placeholder="msg_cmt"></textarea>
        <button :disabled="btnCommentDisabled" @click="sendComment" class="comment"><span v-lang.btn_share></span></button>
      </div>

    <!-- Read Comments PART -->
    <div>
      <span id="title-previous-comments" v-lang.prev_cmt></span>
    </div>

    <div v-if="comments.length != 0">
      <div class="container" v-for="comment in comments">
        <div class="row">
          <div class="col-sm-1">
            <div class="thumbnail">
              <img class="img-responsive user-photo" :src="'https://hypertubeapi.tpayet.com/users/' + comment.username + '/avatar'">
            </div>
          </div>

          <div class="col-sm-5">
            <div class="panel panel-default">
              <div class="panel-heading">
                <router-link :to="'/user/' + comment.username"><strong>{{comment.username}}</strong></router-link>
                <span class="text-muted"><span v-lang.commented></span>{{setCommentsCreatedAt(comment.created_at)}}</span>
              </div>
              <div class="panel-body">
              {{comment.body}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="comments.length == 0" class="badge badge-secondary">
      <span v-lang.no_cmt></span>
    </div>
  </div>

  </div>
</template>

<script>
import {videoUrl} from '@/config.js'
import {commentsUrl} from '@/config.js'
import {backApi} from '@/config.js'


export default{
  name: 'movie',
  computed: {
    msg_cmt()  {
     return this.translate('msg_cmt')
    }
  },
  data(){
    return {
      headers: {
          'Content-Type': 'application/json',
          'access-token': localStorage.getItem('token'),
          'client': localStorage.getItem('client'),
          'expiry': localStorage.getItem('expiry'),
          'token-type': localStorage.getItem('token-type'),
          'uid': localStorage.getItem('uid')
        },
      comments: [],
      advert: true, 
      movieSource: "",
      subEn: "",
      subFr: "",
      videoName: localStorage.getItem('video-name'),
      btnCommentDisabled: false,
      videoToken : localStorage.getItem('video-token'),
      description: '',
      director: '',
      poster: '',
      rating: '',
      runtime: '',
    }
  },
  created: function(){
    this.movieSource = 'https://mdbootstrap.com/img/video/Tropical.mp4'

    if (localStorage.getItem('video-db') == 'false'){
      this.advert = true
      this.btnCommentDisabled = true
      axios({
        method: 'post',
        url: 'http://localhost:5555/url',
        data: {
            "url": localStorage.getItem('video-magnet'),
            "title": localStorage.getItem('video-name')
        },
        headers:{
            'Content-Type': 'application/json'
        }
      })
      .then( (response) => {
        this.movieSource = response.data.videoUrl
        this.subEn = response.data.subtitles['en']
        this.subFr = response.data.subtitles['fr']
        this.$refs.videoPlaying.removeAttribute("loop")
        this.$refs.videoPlaying.setAttribute('poster', '/static/img/loading.gif')
        this.$refs.videoPlaying.setAttribute('crossorigin', 'anonymous')
        this.advert = false
        localStorage.setItem('video-token', response.data.token)
        this.videoToken = response.data.token
        let new_url = "/video/" + this.videoToken
        this.$router.replace(new_url)
        this.setView()
        axios({
          method: 'get',
          url: videoUrl + this.$route.params.which
        })
        .then( (response) => {
          localStorage.setItem('video-id', response.data.id)
          this.btnCommentDisabled = false
          console.log("IN VIDEO GETTING INFOS IN created")
          console.log(response)
          this.description = response.data.description
          this.director = response.data.director
          this.poster = response.data.poster
          this.rating = response.data.rating
          this.runtime = response.data.runtime
        })
        .catch( (error) => {
          console.log(error)
        });
        // need to set if localStorage.getItem('video_id') == null for comments
        // + middware : any routes FROM video localStorage.removeItem('video_id')
        // this.movieSource = "https://mdbootstrap.com/img/video/Tropical.mp4"
      })
      .catch( (error) => {
        console.log(error)
      });
    }

    if (localStorage.getItem('video-db') == 'true'){
      this.advert = false
      this.movieSource = 'http://localhost:5555/video/' + this.$route.params.which
      
      axios({
        method: 'get',
        url: videoUrl + this.$route.params.which,
        headers:{
            'Content-Type': 'application/json'
        }
      })
      .then( (response) => {
        this.$refs.videoPlaying.removeAttribute("loop")
        this.$refs.videoPlaying.setAttribute('poster', '/static/img/loading.gif')
        this.$refs.videoPlaying.setAttribute('crossorigin', 'anonymous')
        this.setView()
        this.subEn = backApi + response.data['subtitles_en']
        this.subFr = backApi + response.data['subtitles_fr']
        console.log("IN VIDEO GETTING INFOS IN created")
        console.log(response)
        this.description = response.data.description
        this.director = response.data.director
        this.poster = response.data.poster
        this.rating = response.data.rating
        this.runtime = response.data.runtime
      })
      .catch( (error) => {
        console.log(error)
      });

      this.getComments()
    }
  },
  methods:{
    setView: function(){
      axios({
        method: 'get',
        url: 'https://hypertubeapi.tpayet.com/videos/' + this.$route.params.which + '/perform',
        headers: this.headers
      })
      .then( (response) => {
      })
      .catch( (error) => {
        console.log(error)
      });
    },
    getComments: function(){
      axios({
        method: 'get',
        url: videoUrl + this.$route.params.which +'/comments',
        headers: this.headers
      })
      .then( (response) => {
        //latest comment displayed last with .slice().reverse()
        this.comments = response.data.slice().reverse()
        console.log("get Comments | this.comments")
        console.log(this.comments)
      })
      .catch( (error) => {
        console.log(error)
      });
    },
    isEnter: function(e){
      if (e.key == 'Enter' && this.btnCommentDisabled == false && this.$refs.commentTxtArea.value != "")
        this.sendComment()
    },
    sendComment: function(){
      axios({
        method: 'post',
        url: commentsUrl,
        data: {
          "comment": 
            {
              "body": this.$refs.commentTxtArea.value,
              "user_id": localStorage.getItem('id'),
              "video_id": localStorage.getItem('video-id')
            }
        },
        headers: this.headers
      })
      .then( (response) => {
        this.getComments()
      })
      .catch( (error) => {
        console.log(error)
      });
      this.$refs.commentTxtArea.value = ""
    },
    setCommentsCreatedAt: function(created){
      var moment = require('moment');
      let now = moment();
      let time = moment(created.slice(0, 10), "YYYY-MM-DD")
      let diff = now.diff(time, 'days')
      if (diff == 0 && this.language == 'en')
        return "today"
      else if (diff == 0 && this.language == 'fr')
        return "aujourd'hui"
      else if (diff == 0 && this.language == 'it')
        return "oggi"
      else if (diff == 0 && this.language == 'es')
        return "hoy"
      else if (diff == 0 && this.language == 'de')
        return "heute"
      else if (diff == 1 && this.language == 'en')
        return "yesterday"
      else if (diff == 1 && this.language == 'fr')
        return "hier"
      else if (diff == 1 && this.language == 'it')
        return "ieri"
      else if (diff == 1 && this.language == 'es')
        return "ayer"
      else if (diff == 1 && this.language == 'de')
        return "gestern"
      else if (this.language == 'fr')
        return "il y a " + diff + " jours."
      else if (this.language == 'it')
        return diff + " giorni fa."
      else if (this.language == 'es')
        return "hay " + diff + " días."
      else if (this.language == 'de')
        return "vor " + diff + " tagen."
      else
        return diff + " days ago."
    }
  }
}

</script>

<style scoped>
  .movie{
    width: 100%;
  }
  video{
    border: 1px solid black;
    width: 100%;
  }
  .video-js{
    height: 100%;
  }
  #advertisement{
    border: 1px solid black;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.3);
    position: absolute;
    font-size: 1.6vw;
    margin-right: 0px;
    padding-right: 0px;
  }
  .infos{
    display: flex;
    margin-top: 10px;
  }
  #info-mid{
    flex-direction: column;
    margin-top: 10px;
  }
  #info-right{
    margin-top: 10px;
  }
  #comment-area{
    margin: 6% auto 8% auto;
  }
  .comment{
    border: 1px solid gainsboro;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    padding: 5px 5px 5px 5px;
  }
  #title-previous-comments{
    font-size: 6vw;
    margin-bottom: 20px;
  }
  #title-video{
    font-size: 7vw;
    margin-bottom: 20px;
  }
</style>