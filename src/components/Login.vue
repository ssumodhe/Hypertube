<template>
  <div class="login">
    <h1>Login Page</h1>
    {{note}}
  </div>
</template>

<script>
export default{
  name: 'login',
  data(){
    return {
      note: "This is the Login page. \nFor: SignUp and SignIn"
    }
  }
}
</script>