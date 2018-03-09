<template>
  <div class="signin">
    <button v-on:click="setLs">Set</button>
    <button v-on:click="getLs">Get</button>
    <button v-on:click="removeLs">Remove</button>
    
    <p>With the following :</p>
    <div class="social-buttons">
      <a href="#42"><img width="10%" src="/static/img/social-icons/42-icon.png" title="Connect with 42" alt="42-icon"></a>
      <a href="#facebook"><img width="10%" src="/static/img/social-icons/facebook-icon.png" title="Connect with facebook" alt="facebook-icon"></a>
      <a href="#github"><img width="10%" src="/static/img/social-icons/github-icon.png" title="Connect with github" alt="github-icon"></a>
      <a href="#gmail"><img width="10%" src="/static/img/social-icons/gmail-icon.png" title="Connect with gmail" alt="gmail-icon"></a>
    </div>

    <p>Or here :</p>
    <form @submit.prevent="submitSignIn">
    	<div class="form-group has-feedback" v-bind:class="[userSuccessClass]">
    		<label for="signInUser" class="control-label sr-only">
    			user name
    		</label>
    		<input ref="txtUser" type="text" id="signInUser" class="form-control" name="user" placeholder="UserName." @input="checkUserValidation" required>
    		<span  v-bind:class="[userIconClass]"></span>
    	</div>

    	<div class="form-group has-feedback"  v-bind:class="[passwordSuccessClass]">
    		<label for="signInPassword" class="control-label sr-only">
    			secret password
    		</label>
    		<input ref="txtPassword"  id="signInPassword"  type="password" class="form-control" name="password" placeholder="Password." @input="checkPasswordValidation" pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+).{6,}$" required>
    		<span  v-bind:class="[passwordIconClass]"></span>
    	</div>

      <div v-if="errorMessage" class="alert alert-danger" role="alert">{{errorMessage}}
      </div>

      <div class="checkbox">
        <label>
          <input type="checkbox" id="checkRemember" v-model="rememberMe"> Remember Me!
        </label>
      </div>

    	<input v-bind:disabled="submitBtnDisabled" class="btn btn-default" type="submit" value="Sign In!">
    </form>

  </div>
</template>

<script>
export default{
  name: 'signin',
  props:{
    errorMessage: {
      type: String,
      required: false,
      default: ''
    }
  },
  data(){
    return {
      note: "Form sign In here",
      userSuccessClass: '',
      passwordSuccessClass: '',
      userIconClass: '',
      passwordIconClass: '',
      submitBtnDisabled: true,
      rememberMe: false
    }
  },
  mounted: function(){
    let user = document.cookie.match('(^|;)\\s*' + 'user' + '\\s*=\\s*([^;]+)')
    this.$refs.txtUser.value = user ? user.pop() : ''
    if(this.$refs.txtUser.checkValidity()){
        this.userSuccessClass = "has-success"
        this.userIconClass = "glyphicon glyphicon-ok form-control-feedback"
      }
  },
  methods: {
    checkUserValidation: function(){
      if(this.$refs.txtUser.checkValidity()){
        this.userSuccessClass = "has-success"
        this.userIconClass = "glyphicon glyphicon-ok form-control-feedback"
        if(this.$refs.txtPassword.checkValidity())
          this.submitBtnDisabled = false
      } else{
        this.userSuccessClass = "has-error"
        this.userIconClass = "glyphicon glyphicon-remove form-control-feedback"
        this.submitBtnDisabled = true
      }
    },
    checkPasswordValidation: function(){
      if(this.$refs.txtPassword.checkValidity()){
        this.passwordSuccessClass = "has-success"
        this.passwordIconClass = "glyphicon glyphicon-ok form-control-feedback"
        if(this.$refs.txtUser.checkValidity())
          this.submitBtnDisabled = false
      } else{
        this.passwordSuccessClass = "has-error"
        this.passwordIconClass = "glyphicon glyphicon-remove form-control-feedback"
        this.submitBtnDisabled = true
      }
    },
  	submitSignIn: function() {
      let user = this.$refs.txtUser.value.trim()
  		let password = this.$refs.txtPassword.value.trim()

      // Reset 
      this.$refs.txtUser.value = ""
      this.$refs.txtPassword.value = ""
      this.userSuccessClass = ''
      this.passwordSuccessClass = ''
      this.userIconClass = ''
      this.passwordIconClass = ''
      this.submitBtnDisabled = true

      // Cookie
      if(this.rememberMe){
        let date = new Date()
        date.setTime(date.getTime() + (30*25*60*60*1000))
        // current day + 30days for expiration time
        document.cookie = 'user=' + user + '; expires=' + date.toUTCString() + '; path=/'
      } else {
        document.cookie = 'user=; expires=Sat, 8 Dec 1956 23:59:59 UTC; path:/;'
      }

      this.$emit('loginCredentials',
          {
            'user': user,
            'password': password
          }
        )
  	},
    setLs: function(){
      localStorage.setItem('token', 'this is the super crypted token')
      console.log('Setting LocalStorage')
    },
    getLs: function(){
      console.log(localStorage.getItem('token'))
      // console.log(localStorage.token)
    },
    removeLs: function(){
      localStorage.removeItem('token')
      console.log('Removing LocalStorage')
    }

  }
}
</script>

<style scoped>
.social-buttons img{
  margin: auto 5% 5% 5%;
  border: 1px solid gainsboro;
  border-radius: 30%;
}
</style>