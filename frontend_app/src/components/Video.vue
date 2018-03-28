<template>
  <div class="movie">
    {{note}}

    <br>
    <br>
    <br>

    <div>
      <span v-if="advert" id="advertisement"><strong><span v-lang.msg_ad></span></strong></span>
      <video autoplay="autoplay" loop controls preload="metadata" :src="movieSource" poster="/static/img/loading.gif">
        <track kind="subtitles" src="https://streamingapi.tpayet.com/subtitles/Interstellar.2014.720p.BluRay.x264-DAA.vtt" srclang="en" label="English" default="">
        <track kind="subtitles" src="https://streamingapi.tpayet.com/subtitles/Interstellar.2014.720p.BluRay.x264.DTS-WiKi.fr.vtt" srclang="fr" label="French">
        <canvas></canvas>
      </video>
      <!-- <video autoplay muted="true" controls="controls" poster="/static/img/emoji_kitty.png">
        <source v-if="advert" :src="movieSource" type="video/mp4"></source> 
        <source v-if="!advert" :src="movieSource" type="video/mp4"></source>
      </video> -->
    </div>

<!--     <video autoplay loop muted="true" controls class="video-js">
      <source
        src="http://e1r5p16.42.fr:5555/video/YmsorVS9x4x1YA4abxEV3LQ7LAoDH2xXXTjgyMcZWeXdYPmf1xutJJcSEQWESRRMMDSDaQQwXWR8JsK6tSkjpakbPKQszXLx1Tfu4EXDarC1Gk6xxdY6j5t5eL3NJihJPsrQBmmf6BtT1R42uLvHWxvYfBxJwJH6R7hCxRAbvQjTphupyj92" type="video/mp4">
      <track kind="subtitles" src="http://localhost:8080/static/sub.vtt" srclang="en" label="English" default="">
      <track kind="subtitles" src="http://e1r5p16.42.fr:5555/sub.vtt" srclang="fr" label="French" default="">
    </video> -->

    <div class="comments">
      <div id="comment-area">
        <textarea ref="commentTxtArea" @keydown="isEnter" @keydown.enter.prevent class="comment" cols="60" rows="6" :placeholder="msg_cmt"></textarea>
        <button @click="sendComment" class="comment"><span v-lang.btn_share></span></button>
      </div>

      <div>
        <span id="title-previous-comments" v-lang.prev_cmt></span>
      </div>
      <div v-if="comments.length != 0">
      <div class="container" v-for="comment in comments">
        <div class="row">

          <div class="col-sm-1">
            <div class="thumbnail">
              <img class="img-responsive user-photo" src="https://ssl.gstatic.com/accounts/ui/avatar_2x.png">
            </div>
          </div>

          <div class="col-sm-5">
            <div class="panel panel-default">
              <div class="panel-heading">
                <router-link to="/user/totolapaille"> <strong>{{comment.user_id}}</strong></router-link> <span class="text-muted"><span v-lang.commented></span>{{setCommentsCreatedAt(comment.created_at)}}</span>
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
export default{
  name: 'movie',
  computed: {
    msg_cmt()  {
     return this.translate('msg_cmt')
    }
  },
  data(){
    return {
      note: "This is the Streaming page !",
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
      movieSource: "https://www.w3schools.com/html/mov_bbb.mp4"
    }
  },
  created: function(){
    axios({
      method: 'post',
      url: 'https://hypertubeapi.tpayet.com/streaming/download',
      data: {
        "streaming": 
          {
            "url": "http://www.torrent9.red/get_torrent/interstellar-french-dvdrip-2014.torrent",
            "title": "interstellar"
          }
      },
      headers:{
          'Content-Type': 'application/json'
      }
    })
    .then( (response) => {
      this.note = response.data
      // this.movieSource = response.data
      // need to set if localStorage.getItem('video_id') == null for comments
      // + middware : any routes FROM video localStorage.removeItem('video_id')
      // this.movieSource = "https://mdbootstrap.com/img/video/Tropical.mp4"
      this.movieSource = 'https://streamingapi.tpayet.com/video/2bbfa58659e8d9541e803a4b803d2352b8bc4ecb'
      this.advert = false
    })
    .catch( (error) => {
      console.log(error)
    });

    axios({
      method: 'get',
      url: 'https://hypertubeapi.tpayet.com/videos/'+ this.$route.params.which +'/comments'
      })
      .then( (response) => {
        //latest comment displayed last with .slice().reverse()
        this.comments = response.data.slice().reverse()
      })
      .catch( (error) => {
        console.log(error)
    });
  },
  methods:{
    isEnter: function(e){
      if (e.key == 'Enter')
        this.sendComment()
    },
    sendComment: function(e){
      axios({
        method: 'post',
        url: 'https://hypertubeapi.tpayet.com/comments',
        data: {
          "comment": 
            {
              "body": this.$refs.commentTxtArea.value,
              "user_id": localStorage.getItem('id'),
              "video_id": localStorage.getItem('video_id')
            }
        },
        headers: this.headers
      })
      .then( (response) => {
        //do new axios get comments ?? + set infiniteLoader for comments
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
    font-size: 8vw;
    margin-bottom: 20px;
  }
</style>