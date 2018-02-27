<template>
  <div class="login">
    <h1>Login Page</h1>
    <div>{{note}}</div>
    
    <div class="row">

    <div class="col-md-4 col-md-offset-2">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title"><span class="glyphicon glyphicon-plus-sign"></span>  Sign Up </h3>
        </div>
        <div class="panel-body">
          <signup
            v-on:signupInfos="checkInfos"
            :errorMessage="errorMsgSignUp"
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
      errorMsgSignUp: ""
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
          email: form.user,
          password: form.password
        }
      })
        .then( (response) => {
          console.log("response's data:");
          console.log(response.data);
          console.log("response's header:");
          console.log(response.headers);
          this.errorMsgSignIn = ""
        })
        .catch( (error) => {
          console.log("response's error:");
          console.log(error);
          this.errorMsgSignIn = "Not valid email or password."
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
          // user: form.user,
          // picture: form.picture,
          // firstName: form.firstName,
          // lastName: form.lastName,
          password: form.password,
          // checkPassword: form.checkPassword
          password_confirmation: form.checkPassword

        }
      })
        .then( (response) => {
          console.log("response's data:");
          console.log(response.data);
          console.log("response's header:");
          console.log(response.headers);
          this.errorMsgSignUp = ""
        })
        .catch( (error) => {
          console.log("response's error:");
          console.log(error);
          this.errorMsgSignUp = "An error occurred. Please try again."
        });
      // this.$router.push('/')

    }
  }
}
</script>