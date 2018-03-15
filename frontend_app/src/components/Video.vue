<template>
  <div class="movie">
    <h1>Video Page</h1>
    {{note}}

    <br>
    <br>
    <br>

    <video autoplay loop muted="true" controls>
      <source :src="movieSource" type="video/mp4"></source> 
    </video>


<!--     <video autoplay loop muted="true" controls class="video-js">
      <source
        src="http://e1r5p16.42.fr:5555/video/YmsorVS9x4x1YA4abxEV3LQ7LAoDH2xXXTjgyMcZWeXdYPmf1xutJJcSEQWESRRMMDSDaQQwXWR8JsK6tSkjpakbPKQszXLx1Tfu4EXDarC1Gk6xxdY6j5t5eL3NJihJPsrQBmmf6BtT1R42uLvHWxvYfBxJwJH6R7hCxRAbvQjTphupyj92" type="video/mp4">
      <track kind="subtitles" src="http://localhost:8080/static/sub.vtt" srclang="en" label="English" default="">
      <track kind="subtitles" src="http://e1r5p16.42.fr:5555/sub.vtt" srclang="fr" label="French" default="">
    </video> -->

    <div class="comments">
      <div class="comment-wrap">
          <div class="photo">
              <div class="avatar" style="background-image: url('https://s3.amazonaws.com/uifaces/faces/twitter/dancounsell/128.jpg')"></div>
          </div>
          <div class="comment-block">
              <form action="">
                  <textarea name="" id="" cols="30" rows="3" placeholder="Add comment..."></textarea>
              </form>
          </div>
      </div>

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
                <strong>{{comment.title}}</strong> <span class="text-muted">commented 5 days ago</span>
              </div>
              <div class="panel-body">
              {{comment.body}}
              </div>
            </div>
          </div>

        </div>
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
      comments: [],
      infos: [],
      movieSource: ""


    }
  },
  watch: {
    movieSource: function (val) {
      this.movieSource = val
    },
  },
  created: function(){
    axios({
      method: 'get',
      url: 'https://hypertubeapi.tpayet.com/sleep?time=10'
      })
      .then( (response) => {
        this.infos = response
        console.log("this.infos = ")
        console.log(this.infos)
        this.movieSource = "https://mdbootstrap.com/img/video/Tropical.mp4"
        console.log(this.movieSource)
      })
      .catch( (error) => {
        console.log(error)
      });

    axios({
      method: 'get',
      url: 'https://jsonplaceholder.typicode.com/posts'
      })
      .then( (response) => {
        this.comments = response.data.slice(0, 50)
      })
      .catch( (error) => {
        console.log(error)
      });

    // axios({
    //   method: 'post',
    //   url: 'http://192.168.99.100:3000/auth/sign_in',
    //   data: {
    //     email: 'tpayet@student.42.fr',
    //     password: 'QWErty123'
    //   }
    // })
    //   .then(function (response) {
    //     console.log("response's data:");
    //     console.log(response.data);
    //     console.log("response's header:");
    //     console.log(response.headers);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
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
</style>