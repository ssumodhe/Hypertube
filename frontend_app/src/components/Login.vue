<template>
  <div class="login">

    <div v-if="successMsg" class="alert alert-success" role="alert">{{successMsg}}</div>
    
    <div class="row">

    <div class="col-md-4 col-md-offset-2">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title"><span class="glyphicon glyphicon-plus-sign"></span> <span v-lang.signup></span></h3>
        </div>
        <div class="panel-body">
          <signup
            v-on:signupInfos="checkInfos"
            :errorMsg="errorMsgSignUp"
          ></signup>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title"><span class="glyphicon glyphicon-user"></span> <span v-lang.signin></span></h3>
        </div>
        <div class="panel-body">
          <signin 
          v-on:loginCredentials="checkCredentials" 
          :errorMessage="errorMsgSignIn"
          ></signin>
          
        </div>
      </div>
    </div>


    </div>



  </div>
</template>

<script>
import Signup from '@/components/login-signup'
import Signin from '@/components/login-signin'
import {signInUrl} from '@/config.js'
import {signUpUrl} from '@/config.js'
export default{
  name: 'login',
  data(){
    return {
      note: "This is the Login page. For: SignUp and SignIn",
      errorMsgSignIn: "",
      errorMsgSignUp: "",
      successMsg: ""
    }
  },
  components: {
    Signup, Signin
  },
  methods:{
    checkCredentials: function(form){
      axios({
        method: 'post',
        url: signInUrl,
        data: {
          username: form.user.toLowerCase().trim(),
          password: form.password
        }
      })
        .then( (response) => {
          localStorage.setItem('token', response.headers['access-token'])
          localStorage.setItem('client', response.headers['client'])
          localStorage.setItem('expiry', response.headers['expiry'])
          localStorage.setItem('token-type', response.headers['token-type'])
          localStorage.setItem('uid', response.headers['uid'])


          localStorage.setItem('id', response.data.data['id'])
          localStorage.setItem('email', response.data.data['email'])
          localStorage.setItem('picture', response.data.data['picture'])
          localStorage.setItem('firstname', response.data.data['firstname'])
          localStorage.setItem('lastname', response.data.data['lastname'])
          localStorage.setItem('username', response.data.data['username'])
          this.errorMsgSignIn = ""
          this.$router.push('/')
        })
        .catch( (error) => {
          if (error.response.status == "401"){
            this.errorMsgSignIn = error.response.data.errors[0];
          } else {
            this.errorMsgSignIn = "An error occurred. Please try again.";
          }
        });

    },
    checkInfos: function(form){
      axios({
        method: 'post',
        url: signUpUrl,
        data: {
          email: form.email.toLowerCase().trim(),
          username: form.user.toLowerCase().trim(),
          image_base: form.picture,
          firstname: form.firstName,
          lastname: form.lastName,
          password: form.password,
          password_confirmation: form.checkPassword
        }
      })
        .then( (response) => {
          this.errorMsgSignUp = ""
          this.successMsg = "Well done! You successfully signed up. Please check your mails."
          console.log(response)
        })
        .catch( (error) => {
          if (error.response.status == "422"){
            this.errorMsgSignUp = error.response.data.errors.full_messages[0];
          } else {
            this.errorMsgSignUp = "An error occurred. Please try again.";
          }
        });
    }
  }
}
</script>