<template>
  <div class="movie">
    <h1>Video Page</h1>
    {{note}}

    <br>
    <br>
    <br>

    <video autoplay loop muted="true" controls>
      <source src="https://mdbootstrap.com/img/video/Tropical.mp4" type="video/mp4"></source> 
    </video>

<!--     <video autoplay loop muted="true" controls class="video-js">
      <source
        src="http://e1r5p16.42.fr:5555/video/YmsorVS9x4x1YA4abxEV3LQ7LAoDH2xXXTjgyMcZWeXdYPmf1xutJJcSEQWESRRMMDSDaQQwXWR8JsK6tSkjpakbPKQszXLx1Tfu4EXDarC1Gk6xxdY6j5t5eL3NJihJPsrQBmmf6BtT1R42uLvHWxvYfBxJwJH6R7hCxRAbvQjTphupyj92" type="video/mp4">
      <track kind="subtitles" src="http://localhost:8080/static/sub.vtt" srclang="en" label="English" default="">
      <track kind="subtitles" src="http://e1r5p16.42.fr:5555/sub.vtt" srclang="fr" label="French" default="">
    </video> -->

  </div>
</template>

<script>
export default{
  name: 'movie',
  data(){
    return {
      note: "This is the Streaming page !",

    }
  },
  created: function(){

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
  video{
    border: 1px solid black;
    width: 100%;
  }
  .video-js{
    height: 100%;
  }
</style>