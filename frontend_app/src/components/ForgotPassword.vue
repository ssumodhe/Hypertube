<template>
	<div class="password">
		<div class="row">
			<div class="col-md-4 col-md-offset-4">
			<small><mark v-lang.msg_pswd></mark></small>
            <form @submit.prevent="submitPwd">

              <div class="form-group has-feedback" v-bind:class="[newPwdSuccessClass]">
                <input ref="txtNewPwd" type="password" class="form-control" :placeholder="new_pswd" @input="newPwdValidation" pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+).{7,}$" required>
              </div>

              <div class="form-group has-feedback" v-bind:class="[cfmPwdSuccessClass]">
                <input ref="txtCfmPwd" type="password" class="form-control" :placeholder="confirm_password" @input="cfmPwdValidation" pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+).{7,}$" required>
              </div>

              <input v-bind:disabled="pwdSubmitBtnDisabled" class="btn btn-default" type="submit" value="Modif.">
            
            </form>
            </div>
		</div>
	</div>		
</template>

<script>
export default{
  name: 'password',
  computed:{
    new_pswd()  {
     return this.translate('new_pswd')
    },
    confirm_password()  {
     return this.translate('confirm_password')
    },
  },
  data(){
    return{
    	newPwdSuccessClass: '',
      	cfmPwdSuccessClass: '',
      	pwdSubmitBtnDisabled: true
    }
  },
  methods:{
  	checkAllValidation: function(){
      if(this.$refs.txtNewPwd.checkValidity()
        && this.$refs.txtCfmPwd.checkValidity())
        return true
      else
        return false
    },
  	newPwdValidation: function(){
  		if(this.$refs.txtNewPwd.checkValidity()){
	        this.newPwdSuccessClass = "has-success"
	        if (this.checkAllValidation() == true){
	          this.pwdSubmitBtnDisabled = false
	        }
		} else {
			this.newPwdSuccessClass = "has-error"
			this.pwdSubmitBtnDisabled = true
		}
  	},
  	cfmPwdValidation: function(){
  	if(this.$refs.txtCfmPwd.checkValidity()
        && this.$refs.txtCfmPwd.value == this.$refs.txtNewPwd.value){
        this.cfmPwdSuccessClass = "has-success"
        if (this.checkAllValidation() == true){
          this.pwdSubmitBtnDisabled = false
        }
    } else {
        this.cfmPwdSuccessClass = "has-error"
        this.pwdSubmitBtnDisabled = true
    }
  	},
  	submitPwd: function(){
  		// send
  	}
  }
}

</script>

<style scoped >
</style>