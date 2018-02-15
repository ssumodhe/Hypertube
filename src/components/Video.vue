<template>
  <div class="movie">
    <h1>Video Page</h1>
    {{note}}

    <br>
    <br>
    <br>

    <div>
      <ul>
        <li v-for="lib in library">
          <span>{{lib.id}}: {{lib.title}}</span>
        </li>
      </ul>
    </div>

    <!-- <video controls>
     <source src="http://e2r3p14.42.fr:5555/video" type="video/mp4"></source> 
     </video> -->
  </div>
</template>

<script>
export default{
  name: 'movie',
  data(){
    return {
      note: "This is the Streaming page !",
      library : []
    }
  },
  created: function(){
    this.$http.get('https://jsonplaceholder.typicode.com/albums')
      .then(function(response){
        this.library = response.data;
      })

    axios({
      method: 'post',
      url: 'http://192.168.99.100:3000/auth/sign_in',
      data: {
        email: 'tpayet@student.42.fr',
        password: 'QWErty123'
      }
    })
      .then(function (response) {
        console.log("response's data:");
        console.log(response.data);
        console.log("response's header:");
        console.log(response.headers);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

</script>