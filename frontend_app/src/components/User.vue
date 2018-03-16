<template>
  <div class="user">
    <h1>User Page</h1>
    {{note}}
    {{stalker}}

    <div class="row">
      <div class="col-md-2 col-md-offset-3">
        <div class="card">
            <div class="card-header" role="tab" id="headingZero">
              <h5 class="mb-0">
                <!-- <a data-toggle="collapse" data-parent="#accordion" href="#collapseZero" aria-expanded="true" aria-controls="collapseZero"> -->
                  <img class="img-circle" src="/static/img/emoji_kitty.png" width="100px">
                <!-- </a> -->
              </h5>
            </div>
            <div v-if="!stalker" id="collapseZero" class="collapse show" role="tabpanel" aria-labelledby="headingZero">
              <div class="card-block">
                <uploadfile class="uploadfile"></uploadfile>
              </div>
            </div>
          </div>
      </div>

      <div class="col-md-5">
        <div v-if="!stalker" class="badge badge-secondary" style="margin-bottom: 5px;">
          <span>Click on any item to modify your data.</span>
        </div>
        <div id="accordion" role="tablist" aria-multiselectable="true">
          <div class="card">
            <div class="card-header " role="tab" id="headingOne">
              <h5 class="mb-0 ">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  <span class="glyphicon glyphicon-user"></span>
                  <p>{{userName}}</p>
                </a>
              </h5>
            </div>
            <div v-if="!stalker" id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingOne">
              <div class="card-block">
                
                <form>
                  <input type="text" name="username" :placeholder="userName">
                </form>





              </div>
            </div>
          </div>

          <div  v-if="!stalker" class="card">
            <div class="card-header" role="tab" id="headingTwo">
              <h5 class="mb-0">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  <span class="h4"><strong>@</strong></span>
                  <p>{{email}}</p>
                </a>
              </h5>
            </div>
            <div id="collapseTwo" class="collapse" role="tabpanel" aria-labelledby="headingTwo">
              <div class="card-block">
                <form>
                  <input type="text" name="username" :placeholder="email">
                </form>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" role="tab" id="headingThree">
              <h5 class="mb-0">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  <span class="glyphicon glyphicon-tags"></span>
                  <p>{{firstName}} {{lastName}}</p>
                </a>
              </h5>
            </div>
            <div v-if="!stalker" id="collapseThree" class="collapse" role="tabpanel" aria-labelledby="headingThree">
              <div class="card-block">
                <form>
                  <input type="text" name="username" :placeholder="firstName">
                  <input type="text" name="username" :placeholder="lastName">
                </form>
              </div>
            </div>
          </div>

          <div  v-if="!stalker" class="card">
            <div class="card-header" role="tab" id="headingFour">
              <h5 class="mb-0">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                  <span class="glyphicon glyphicon-lock"></span>
                  <p>Password.</p>
                </a>
              </h5>
            </div>
            <div id="collapseFour" class="collapse" role="tabpanel" aria-labelledby="headingFour">
              <div class="card-block">
                <form>
                  <input type="text" name="username" placeholder="Old password">
                  <input type="text" name="username" placeholder="New password">
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>


  </div>
</template>

<script>
import Uploadfile from '@/components/upload-file'
import {userUrl} from '../config.js'


export default{
  name: 'user',
  components:{
    Uploadfile
  },
  created(){
    if (this.$route.params.username == localStorage.getItem('username')){
      this.stalker = false
    }
    else{
      this.stalker = true
    }
    axios({
      method: 'get',
      url: userUrl + this.$route.params.username,
      headers: this.headers
      })
      .then( (response) => {
        console.log(response)
        this.userName = response.data.username
        this.email = response.data.email
        this.firstName = response.data.firstname
        this.lastName = response.data.lastname
      })
      .catch( (error) => {
        console.log(error)
      });
  },
  data(){
    return {
      note: "This is " + this.$route.params.username + "'s profile page!!",
      stalker: false,
      headers: {
          'access-token': localStorage.getItem('token'),
          'client': localStorage.getItem('client'),
          'expiry': localStorage.getItem('expiry'),
          'token-type': localStorage.getItem('token-type'),
          'uid': localStorage.getItem('uid')
        },
      userName: "",
      email: "",
      firstName: "",
      lastName: ""

    }
  }
}
</script>

<style scoped>
  .card {
    border: 1px solid rgba(0,0,0,.125);
    border-radius: .25rem;
    margin-bottom: 5px;
  }
  .card-header{
    background-color: rgba(241,241,241,.125);
    border: 1px solid rgba(0,0,0,.125);
    border-radius: .25rem;
  }
  a {
    text-decoration: none;
    color: #555;
  }

  input {
    margin: 5px auto 5px auto;
  }
  .uploadfile{
    margin: 5px 5px 5px 5px;
  }

</style>