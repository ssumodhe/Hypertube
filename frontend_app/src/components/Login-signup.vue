<template>
  <div class="signup">
    
    <span>{{note}}</span>

    <form @submit.prevent="submitSignUp" enctype="multipart/form-data">
    	<div class="form-group has-feedback" v-bind:class="[emailSuccessClass]">
    		<label for="email" class="control-label sr-only">
    			email address
    		</label>
    		<input ref="txtEmail" type="email" id="email" class="form-control" name="email" placeholder="Email." @input="checkEmailValidation" required>
    		<span  v-bind:class="[emailIconClass]"></span>
    	</div>

    	<div class="form-group has-feedback" v-bind:class="[userSuccessClass]">
    		<label for="signUpUser" class="control-label sr-only">
    			user name
    		</label>
    		<input ref="txtUser" type="text" id="signUpUser" class="form-control" name="user" placeholder="Username." @input="checkUserValidation" pattern="^([a-zA-Z]*)$" required>
    		<span  v-bind:class="[userIconClass]"></span>
    	</div>

    	<!-- Picture div -->
      <uploadfile
        v-on:uploadedPicture="addPicture"
      ></uploadfile>
      

    	<div class="form-group has-feedback" v-bind:class="[firstNameSuccessClass]">
    		<label for="firstName" class="control-label sr-only">
    			first name
    		</label>
    		<input ref="txtFirstName" type="text" id="firstName" class="form-control" name="firstName" placeholder="First Name." @input="checkFirstNameValidation" pattern="^([a-zA-Z]*)$" required>
    		<span  v-bind:class="[firstNameIconClass]"></span>
    	</div>

    	<div class="form-group has-feedback" v-bind:class="[lastNameSuccessClass]">
    		<label for="lastName" class="control-label sr-only">
    			last name
    		</label>
    		<input ref="txtLastName" type="text" id="lastName" class="form-control" name="lastName" placeholder="Last Name." @input="checkLastNameValidation" pattern="^([a-zA-Z]*)$" required>
    		<span  v-bind:class="[lastNameIconClass]"></span>
    	</div>

    	<div class="form-group has-feedback" v-bind:class="[passwordSuccessClass]">
    		<label for="signUpPassword" class="control-label sr-only">
    			secret password
    		</label>
    		<input ref="txtPassword" type="password" id="signUpPassword" class="form-control" name="password" placeholder="Password." @input="checkPasswordValidation" pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+).{6,}$" required>
    		<span  v-bind:class="[passwordIconClass]"></span>
        <small><mark>
        Your password needs to be at least 6 chars long.
        <br> With lower and upper cases and digits only.
        </mark></small>
    	</div>

    	<div class="form-group has-feedback" v-bind:class="[checkPasswordSuccessClass]">
    		<label for="checkPassword" class="control-label sr-only">
    			check secret password
    		</label>
    		<input ref="txtCheckPassword" type="password" id="checkPassword" class="form-control" name="checkPassword" placeholder="Check Password." @input="checkCheckPasswordValidation" required>
    		<span  v-bind:class="[checkPasswordIconClass]"></span>
    	</div>

      <div v-if="errorMsg" class="alert alert-danger" role="alert">{{errorMsg}}
      </div>

    	<input v-bind:disabled="submitBtnDisabled" class="btn btn-default" type="submit" value="Sign Up!">

    </form>



  </div>
</template>

<script>
import Uploadfile from '@/components/upload-file'

export default{
  name: 'signup',
  props:{
    errorMsg: {
      type: String,
      required: false,
      default: ''
    }
  },
  data(){
    return {
      note: "Form sign Up here",
      emailSuccessClass: '',
      emailIconClass: '',
      userSuccessClass: '',
      userIconClass: '',
      firstNameSuccessClass: '',
      firstNameIconClass: '',
      lastNameSuccessClass: '',
      lastNameIconClass: '',
      passwordSuccessClass: '',
      passwordIconClass: '',
      checkPasswordSuccessClass: '',
      checkPasswordIconClass: '',
      submitBtnDisabled: true,
      picture: ''
    }
  },
  components:{
    Uploadfile
  },
  methods: {
  	checkEmailValidation: function(){
  		if(this.$refs.txtEmail.checkValidity()){
	        this.emailSuccessClass = "has-success"
	        this.emailIconClass = "glyphicon glyphicon-ok form-control-feedback"
	        if(this.checkAllValidation())
	          this.submitBtnDisabled = false
	    } else{
	        this.emailSuccessClass = "has-error"
	        this.emailIconClass = "glyphicon glyphicon-remove form-control-feedback"
	        this.submitBtnDisabled = true
	    }
  	},
  	checkUserValidation: function(){
	  	if(this.$refs.txtUser.checkValidity()){
	        this.userSuccessClass = "has-success"
	        this.userIconClass = "glyphicon glyphicon-ok form-control-feedback"
	        if(this.checkAllValidation())
	          this.submitBtnDisabled = false
	    } else{
	        this.userSuccessClass = "has-error"
	        this.userIconClass = "glyphicon glyphicon-remove form-control-feedback"
	        this.submitBtnDisabled = true
	    }
  	},
  	checkFirstNameValidation: function(){
  		if(this.$refs.txtFirstName.checkValidity()){
	        this.firstNameSuccessClass = "has-success"
	        this.firstNameIconClass = "glyphicon glyphicon-ok form-control-feedback"
	        if(this.checkAllValidation())
	          this.submitBtnDisabled = false
	    } else{
	        this.firstNameSuccessClass = "has-error"
	        this.firstNameIconClass = "glyphicon glyphicon-remove form-control-feedback"
	        this.submitBtnDisabled = true
	    }
  	},
  	checkLastNameValidation: function(){
  		if(this.$refs.txtLastName.checkValidity()){
	        this.lastNameSuccessClass = "has-success"
	        this.lastNameIconClass = "glyphicon glyphicon-ok form-control-feedback"
	        if(this.checkAllValidation())
	          this.submitBtnDisabled = false
	    } else{
	        this.lastNameSuccessClass = "has-error"
	        this.lastNameIconClass = "glyphicon glyphicon-remove form-control-feedback"
	        this.submitBtnDisabled = true
	    }
  	},
  	checkPasswordValidation: function(){
  		if(this.$refs.txtPassword.checkValidity()){
        this.passwordSuccessClass = "has-success"
        this.passwordIconClass = "glyphicon glyphicon-ok form-control-feedback"
        if(this.$refs.txtCheckPassword.value)
          this.checkCheckPasswordValidation()
        if(this.checkAllValidation())
          this.submitBtnDisabled = false
        else{
          this.submitBtnDisabled = true
        }
      } else{
        this.passwordSuccessClass = "has-error"
        this.passwordIconClass = "glyphicon glyphicon-remove form-control-feedback"
        this.submitBtnDisabled = true
      }
  	},
  	checkCheckPasswordValidation: function(){
  		if(this.$refs.txtCheckPassword.value == this.$refs.txtPassword.value
        & this.$refs.txtPassword.checkValidity()){
        this.checkPasswordSuccessClass = "has-success"
        this.checkPasswordIconClass = "glyphicon glyphicon-ok form-control-feedback"
        if(this.checkAllValidation())
          this.submitBtnDisabled = false
      } else{
        this.checkPasswordSuccessClass = "has-error"
        this.checkPasswordIconClass = "glyphicon glyphicon-remove form-control-feedback"
        this.submitBtnDisabled = true
      }
  	},
  	checkAllValidation: function(){
  		if (this.$refs.txtEmail.checkValidity()
        & this.$refs.txtUser.checkValidity()
        & this.picture != ''
        & this.$refs.txtFirstName.checkValidity()
        & this.$refs.txtLastName.checkValidity()
        & this.$refs.txtPassword.checkValidity()
        & (this.$refs.txtCheckPassword.value == this.$refs.txtPassword.value))
        return true
      else
        return false
  	},
    addPicture: function(form) {
      this.picture = form.picture
      if (this.checkAllValidation())
        this.submitBtnDisabled = false
      else{
        this.submitBtnDisabled = true
      } 
    },
    submitSignUp: function() {
      let email = this.$refs.txtEmail.value.trim()
      let user = this.$refs.txtUser.value.trim()
      let picture = this.picture
      let firstName = this.$refs.txtFirstName.value.trim()
      let lastName = this.$refs.txtLastName.value.trim()
      let password = this.$refs.txtPassword.value.trim()
      let checkPassword = this.$refs.txtCheckPassword.value.trim()

      // Reset values is not necessary --> redirect at end of process -> all value automaticaly reset
      this.$refs.txtEmail.value = ""
      this.$refs.txtUser.value = ""
      this.$refs.txtFirstName.value = ""
      this.$refs.txtLastName.value = ""
      this.$refs.txtPassword.value = ""
      this.$refs.txtCheckPassword.value = ""
      this.emailSuccessClass = '',
      this.emailIconClass = '',
      this.userSuccessClass = '',
      this.userIconClass = '',
      this.firstNameSuccessClass = '',
      this.firstNameIconClass = '',
      this.lastNameSuccessClass = '',
      this.lastNameIconClass = '',
      this.passwordSuccessClass = '',
      this.passwordIconClass = '',
      this.checkPasswordSuccessClass = '',
      this.checkPasswordIconClass = '',
      this.submitBtnDisabled = true,
      this.picture = ''



      this.$emit('signupInfos',
          {
            'email': email,
            'user': user,
            'picture': picture,
            'firstName': firstName,
            'lastName': lastName,
            'password': password,
            'checkPassword': checkPassword
          }
        )
    }
  }
}
</script>