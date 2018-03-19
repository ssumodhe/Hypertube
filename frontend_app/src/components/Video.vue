<template>
  <div class="movie">
    <h1>Video Page</h1>
    {{note}}

    <br>
    <br>
    <br>

    <div>
      <span v-if="advert" id="advertisement"><strong>Ad : Your video will play after this ad. </strong></span>
      <video autoplay="autoplay" loop controls :src="movieSource"></video>
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
        <textarea ref="commentTxtArea" @keydown="isEnter" @keydown.enter.prevent class="comment" cols="60" rows="6" placeholder="Add a comment... Share With Us :) "></textarea>
        <button @click="sendComment" class="comment">Share</button>
      </div>

      <div>
        <span id="title-previous-comments">Previous comments</span>
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
                <router-link to="/user/totolapaille"> <strong>{{comment.user_id}}</strong></router-link> <span class="text-muted">commented 5 days ago</span>
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
        <span>No comments yet! Be the first to share ! ;) </span>

      </div>
  </div>

  </div>
</template>

<script>
export default{
  name: 'movie',
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
      this.movieSource = "https://mdbootstrap.com/img/video/Tropical.mp4"
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
        this.comments = response.data
      })
      .catch( (error) => {
        console.log(error)
    });

    // axios({
    //   method: 'get',
    //   url: 'https://jsonplaceholder.typicode.com/posts'
    //   })
    //   .then( (response) => {
    //     this.comments = response.data.slice(0, 50)
    //   })
    //   .catch( (error) => {
    //     console.log(error)
    //   });
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
        console.log(response)
      })
      .catch( (error) => {
        console.log(error)
      });
      this.$refs.commentTxtArea.value = ""

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