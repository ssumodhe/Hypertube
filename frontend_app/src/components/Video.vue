<template>
  <div class="movie">
    <h1>Video Page</h1>
    {{note}}

    <br>
    <br>
    <br>

<!--     <video controls>
      <source src="" type="video/mp4"></source> 
    </video> -->

    <video autoplay loop muted="true" controls>
      <source
        src="https://mdbootstrap.com/img/video/Tropical.mp4" type="video/mp4">
    </video>

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
</style>