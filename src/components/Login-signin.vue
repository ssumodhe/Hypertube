<template>
  <div class="signin">
    
    <span>{{note}}</span>

    <form @submit.prevent="submitSignIn">
    	<div class="form-group has-feedback" v-bind:class="[emailSuccessClass]">
    		<label for="email" class="control-label sr-only">
    			email address
    		</label>
    		<input ref="txtEmail" type="email" id="email" class="form-control" name="email" placeholder="Email." @input="checkEmailValidation" required>
    		<span  v-bind:class="[emailIconClass]"></span>
    	</div>

    	<div class="form-group has-feedback"  v-bind:class="[passwordSuccessClass]">
    		<label for="password" id="password" class="control-label sr-only">
    			secret password
    		</label>
    		<input ref="txtPassword" type="password" class="form-control" name="password" placeholder="Password." @input="checkPasswordValidation" pattern=".{6,}" required>
    		<span  v-bind:class="[passwordIconClass]"></span>
    		<small><mark>
    		Your password needs to be at least 6 chars long.
    		<br> With lower and upper cases and digits.
    		</mark></small>
    	</div>

      <div v-if="errorMessage" class="text-center text-danger">{{errorMessage}}
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
      emailSuccessClass: '',
      passwordSuccessClass: '',
      emailIconClass: '',
      passwordIconClass: '',
      submitBtnDisabled: true,
      rememberMe: false
    }
  },
  mounted: function(){
    let email = document.cookie.match('(^|;)\\s*' + 'email' + '\\s*=\\s*([^;]+)')
    this.$refs.txtEmail.value = email ? email.pop() : ''
    this.checkEmailValidation();
  },
  methods: {
    checkEmailValidation: function(){
      if(this.$refs.txtEmail.checkValidity()){
        this.emailSuccessClass = "has-success"
        this.emailIconClass = "glyphicon glyphicon-ok form-control-feedback"
        if(this.$refs.txtPassword.checkValidity())
          this.submitBtnDisabled = false
      } else{
        this.emailSuccessClass = "has-error"
        this.emailIconClass = "glyphicon glyphicon-remove form-control-feedback"
        this.submitBtnDisabled = true
      }
    },
    checkPasswordValidation: function(){
      if(this.$refs.txtPassword.checkValidity()){
        this.passwordSuccessClass = "has-success"
        this.passwordIconClass = "glyphicon glyphicon-ok form-control-feedback"
        if(this.$refs.txtEmail.checkValidity())
          this.submitBtnDisabled = false
      } else{
        this.passwordSuccessClass = "has-error"
        this.passwordIconClass = "glyphicon glyphicon-remove form-control-feedback"
        this.submitBtnDisabled = true
      }
    },
  	submitSignIn: function() {
      let email = this.$refs.txtEmail.value.trim()
  		let password = this.$refs.txtPassword.value.trim()
      this.$refs.txtEmail.value = ""
      this.$refs.txtPassword.value = ""
      this.emailSuccessClass = ''
      this.passwordSuccessClass = ''
      this.emailIconClass = ''
      this.passwordIconClass = ''
      this.submitBtnDisabled = true

      // Cookie
      if(this.rememberMe){
        let date = new Date()
        date.setTime(date.getTime() + (30*25*60*60*1000))
        // current day + 30days for expiration time
        document.cookie = 'email=' + email + '; expires=' + date.toUTCString() + '; path=/'
      } else {
        document.cookie = 'email=; expires=Sat, 8 Dec 1956 23:59:59 UTC; path:/;'
      }

      this.$emit('loginCredentials',
          {
            'email': email,
            'password': password
          }
        )
  	}

  }
}
</script>