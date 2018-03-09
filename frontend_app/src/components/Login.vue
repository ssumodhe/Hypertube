<template>
  <div class="login">
    <h1>Login Page</h1>
    <div v-if="successMsg" class="alert alert-success" role="alert">{{successMsg}}</div>
    
    <div class="row">

    <div class="col-md-4 col-md-offset-2">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title"><span class="glyphicon glyphicon-plus-sign"></span>  Sign Up </h3>
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
          <h3 class="panel-title"><span class="glyphicon glyphicon-user"></span> Sign In </h3>
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
import {signInUrl} from '../config.js'
import {signUpUrl} from '../config.js'
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
      console.log('User is ' + form.user)
      console.log('Password is ' + form.password)
      console.log('URL : ' + signInUrl)
      axios({
        method: 'post',
        url: signInUrl,
        data: {
          username: form.user,
          password: form.password
        }
      })
        .then( (response) => {
          console.log("SUCCESS response");
          console.log(response);
          console.log("SUCCESS response's data:");
          console.log(response.data);
          console.log("SUCCESS response's header:");
          console.log(response.headers);
          localStorage.setItem('token', response.headers['access-token'])
          console.log(localStorage.getItem('token'))
          this.errorMsgSignIn = ""
        })
        .catch( (error) => {
          console.log("ERROR response's error:");
          console.log(error);
          console.log("ERROR");
          console.log(error.response);
          if (error.response.status == "401"){
            this.errorMsgSignIn = error.response.data.errors[0];
          } else {
            this.errorMsgSignIn = "An error occurred. Please try again.";
          }
        });
      // this.$router.push('/')

    },
    checkInfos: function(form){
      console.log(form)
      axios({
        method: 'post',
        url: signUpUrl,
        data: {
          email: form.email,
          username: form.user,
          // picture: form.picture,
          firstname: form.firstName,
          lastname: form.lastName,
          password: form.password,
          password_confirmation: form.checkPassword

        }
      })
        .then( (response) => {
          console.log("SUCCESS response's data:");
          console.log(response.data);
          console.log("SUCCESS response's header:");
          console.log(response.headers['access-token']);
          // localStorage.setItem('token', response.headers['access-token'])
          // console.log(localStorage.getItem('token'))
          this.errorMsgSignUp = ""
          this.successMsg = "Well done! You successfully signed up. Please check your mails."

        })
        .catch( (error) => {
          console.log("ERROR response's error:");
          console.log(error);
          console.log("ERROR");
          console.log(error.response);
          if (error.response.status == "422"){
            this.errorMsgSignUp = error.response.data.errors.full_messages[0];
          } else {
            this.errorMsgSignUp = "An error occurred. Please try again.";
          }
        });
      // this.$router.push('/')

    }
  }
}
</script>