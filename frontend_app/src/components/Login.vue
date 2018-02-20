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
          :errorMessage="errorMessage"
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
export default{
  name: 'login',
  data(){
    return {
      note: "This is the Login page. For: SignUp and SignIn",
      errorMessage: ""
    }
  },
  components: {
    Signup, Signin
  },
  methods:{
    checkCredentials: function(form){
      console.log('User is ' + form.user)
      console.log('Password is ' + form.password)
    },
    checkInfos: function(form){
      console.log(form)
    }
  }
}
</script>