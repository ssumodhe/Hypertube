<template>
  <div class="signin">
    
    <p v-lang.with></p>
    <div class="social-buttons">
      <a href="https://hypertubeapi.tpayet.com/auth/marvin"><img width="10%" src="/static/img/social-icons/42-icon.png" title="Connect with 42" alt="42-icon"></a>
      <a href="#facebook"><img width="10%" src="/static/img/social-icons/facebook-icon.png" title="Connect with facebook" alt="facebook-icon"></a>
      <a href="#github"><img width="10%" src="/static/img/social-icons/github-icon.png" title="Connect with github" alt="github-icon"></a>
      <a href="#gmail"><img width="10%" src="/static/img/social-icons/gmail-icon.png" title="Connect with gmail" alt="gmail-icon"></a>
    </div>

    <p v-lang.or></p>
    <form @submit.prevent="submitSignIn">
    	<div class="form-group has-feedback" v-bind:class="[userSuccessClass]">
    		<label for="signInUser" class="control-label sr-only">
    			user name
    		</label>
    		<input ref="txtUser" type="text" id="signInUser" class="form-control" name="user" :placeholder="username" @input="checkUserValidation" required>
    		<span  v-bind:class="[userIconClass]"></span>
    	</div>

    	<div class="form-group has-feedback"  v-bind:class="[passwordSuccessClass]">
    		<label for="signInPassword" class="control-label sr-only">
    			secret password
    		</label>
    		<input ref="txtPassword"  id="signInPassword"  type="password" class="form-control" name="password" :placeholder="password" @input="checkPasswordValidation" pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+).{7,}$" required>
    		<span  v-bind:class="[passwordIconClass]"></span>
    	</div>

      <div v-if="errorMessage" class="alert alert-danger" role="alert">{{errorMessage}}
      </div>

      <div class="checkbox">
        <label>
          <input type="checkbox" id="checkRemember" v-model="rememberMe"> <span v-lang.remember_me></span>
        </label>
      </div>

      <div>
        <button type="button" class="btn btn-xs btn-link" data-toggle="collapse" data-target="#forgottenPassword" aria-expanded="false" aria-controls="forgottenPassword" v-lang.forgotten_pswd></button>
        <div class="collapse" id="forgottenPassword">
          <form id="frgtPwdForm" @submit.prevent="forgotPswd">
            <input ref="txtFrgtPswd" @input="checkFrgtPswdValidation" style="margin-bottom: 5px;" class="form-control" type="email" placeholder="Please enter your email">
            <div v-if="errorFrgtPswd" class="alert alert-info" role="alert">{{errorFrgtPswd}}
            </div>
            <input v-bind:disabled="submitBtnFrgtPswd" class="btn btn-default" type="submit" value="Change my password">
          </form>
        </div>
      </div>

    	<input v-bind:disabled="submitBtnDisabled" class="btn btn-default" type="submit" :value="btn_signin">
    </form>

  </div>
</template>

<script>
import {forgotPswd} from '@/config.js'

export default{
  name: 'signin',
  props:{
    errorMessage: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    username()  {
     return this.translate('username')
    },
    password()  {
     return this.translate('password')
    },
    btn_signin()  {
     return this.translate('btn_signin')
    }
  },
  data(){
    return {
      note: "Form sign In here",
      errorFrgtPswd: '',
      userSuccessClass: '',
      passwordSuccessClass: '',
      userIconClass: '',
      passwordIconClass: '',
      submitBtnDisabled: true,
      rememberMe: true,
      submitBtnFrgtPswd: true
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
    checkFrgtPswdValidation: function(){
      if(this.$refs.txtFrgtPswd.checkValidity()){
        this.submitBtnFrgtPswd = false
      } else{
        this.submitBtnFrgtPswd = true
      }
    },
    forgotPswd: function(){
      axios({
        method: 'post',
        url: forgotPswd,
        data: {
          "email": this.$refs.txtFrgtPswd.value, 
          "redirect_url": "http://localhost:8080/password"
        },
        headers:{
            'Content-Type': 'application/json'
        }
      })
      .then( (response) => {
        this.errorFrgtPswd = response.data.message
        console.log(response)

      })
      .catch( (error) => {
        this.errorFrgtPswd = "This email adress does not exists."
        console.log(error)
      });
    },
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
#forgottenPassword{
  border: 1px solid gainsboro;
  margin: 5px auto 5px auto;
}
#frgtPwdForm{
  margin: 5px 5px 5px 5px;

}
</style>