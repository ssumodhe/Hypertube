<template>
  <div class="login">
    <h1>Login Page</h1>
    <div>{{note}}</div>
    
    <div class="col-md-2">
    </div>

    <div class="col-md-4">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title"> Sign Up </h3>
        </div>
        <div class="panel-body">
          <signup></signup>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title"> Sign In </h3>
        </div>
        <div class="panel-body">
          <signin></signin>
        </div>
      </div>
    </div>

    <div class="col-md-2">
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
      note: "This is the Login page. For: SignUp and SignIn"
    }
  },
  components: {
    Signup, Signin
  }
}
</script>