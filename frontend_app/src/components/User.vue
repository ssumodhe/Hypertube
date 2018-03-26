<template>
  <div class="user">
    {{note}}
    {{stalker}}

    <div class="row">
      <div class="col-md-2 col-md-offset-3">
        <div class="card">
            <div class="card-header" role="tab" id="headingZero">
              <h5 class="mb-0">
                <!-- <a data-toggle="collapse" data-parent="#accordion" href="#collapseZero" aria-expanded="true" aria-controls="collapseZero"> -->
                  <img class="img" src="/static/img/emoji_kitty.png" width="100px">
                <!-- </a> -->
              </h5>
            </div>
            <div v-if="!stalker" id="collapseZero" class="collapse show" role="tabpanel" aria-labelledby="headingZero">
              <div class="card-block">
                <uploadfile class="uploadfile" v-on:uploadedPicture="addPicture"></uploadfile>
                <input v-bind:disabled="submitBtnDisabled" class="btn btn-default" type="submit" value="Modif.">
              </div>
            </div>
          </div>
      </div>

      <div class="col-md-5">
        <div v-if="!stalker" class="badge badge-secondary" style="margin-bottom: 5px;">
          <span v-lang.msg_modif></span>
        </div>
        <div id="accordion" role="tablist" aria-multiselectable="true">
          <div class="card">
            <div class="card-header " role="tab" id="headingOne">
              <h5 class="mb-0 ">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  <span class="glyphicon glyphicon-user"></span>
                  <p>{{userName}}</p>
                </a>
              </h5>
            </div>
            <div v-if="!stalker" id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingOne">
              <div class="card-block">
                <form @submit.prevent="submitUsername">
                  <div class="col-md-6 col-md-offset-1" v-bind:class="[userSuccessClass]">
                    <input ref="txtUser" type="text" id="UserName" class="form-control" name="username" :placeholder="userName" @input="checkUserValidation" pattern="^([a-zA-Z]*)$" required>
                  </div>
                  <input v-bind:disabled="userSubmitBtnDisabled" class="btn btn-default" type="submit" value="Modif.">
                </form>
              </div>
            </div>
          </div>

          <div  v-if="!stalker" class="card">
            <div class="card-header" role="tab" id="headingTwo">
              <h5 class="mb-0">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  <span class="h4"><strong>@</strong></span>
                  <p>{{email}}</p>
                </a>
              </h5>
            </div>
            <div id="collapseTwo" class="collapse" role="tabpanel" aria-labelledby="headingTwo">
              <div class="card-block">
                <form @submit.prevent="submitEmail">
                  <div class="col-md-6 col-md-offset-1" v-bind:class="[emailSuccessClass]">
                    <input ref="txtEmail" type="email" id="Email" class="form-control" name="email" :placeholder="email" @input="checkEmailValidation" required>
                  </div>
                  <input v-bind:disabled="emailSubmitBtnDisabled" class="btn btn-default" type="submit" value="Modif.">
                </form>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" role="tab" id="headingThree">
              <h5 class="mb-0">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  <span class="glyphicon glyphicon-tags"></span>
                  <p>{{firstName}} {{lastName}}</p>
                </a>
              </h5>
            </div>
            <div v-if="!stalker" id="collapseThree" class="collapse" role="tabpanel" aria-labelledby="headingThree">
              <div class="card-block">



                <form @submit.prevent="submitName">
                  <div class="form-group has-feedback" v-bind:class="[firstNameSuccessClass]">
                    <input ref="txtFirstName" type="text" id="firstName" class="form-control" name="firstName" :placeholder="firstName" @input="checkFirstNameValidation" pattern="^([a-zA-Z]*)$">
                  </div>

                  <div class="form-group has-feedback" v-bind:class="[lastNameSuccessClass]">
                    <input ref="txtLastName" type="text" id="lastName" class="form-control" name="lastName" :placeholder="lastName" @input="checkLastNameValidation" pattern="^([a-zA-Z]*)$">
                  </div>
                  <input v-bind:disabled="nameSubmitBtnDisabled" class="btn btn-default" type="submit" value="Modif.">
                </form>

              </div>
            </div>
          </div>

          <div  v-if="!stalker" class="card">
            <div class="card-header" role="tab" id="headingFour">
              <h5 class="mb-0">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                  <span class="glyphicon glyphicon-lock"></span>
                  <p v-lang.password></p>
                </a>
              </h5>
            </div>
            <div id="collapseFour" class="collapse" role="tabpanel" aria-labelledby="headingFour">
              <div class="card-block">
                <small><mark v-lang.msg_pswd></mark></small>

                <form @submit.prevent="submitPwd">
                  <div class="form-group has-feedback" v-bind:class="[crtPwdSuccessClass]">
                    <input ref="txtCrtPwd" type="password" class="form-control" :placeholder="old_pswd" @input="crtPwdValidation" pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+).{7,}$" required>
                  </div>

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

        </div>
      </div>
    </div>


  </div>
</template>

<script>
import Uploadfile from '@/components/upload-file'
import {userUrl} from '@/config.js'
import {signUpUrl} from '@/config.js'


export default{
  name: 'user',
  components:{
    Uploadfile
  },
  created(){
    if (this.$route.params.username == localStorage.getItem('username')){
      this.stalker = false
    }
    else{
      this.stalker = true
    }
    axios({
      method: 'get',
      url: userUrl + this.$route.params.username,
      headers: this.headers
      })
      .then( (response) => {
        console.log(response)
        this.userName = response.data.username
        this.email = response.data.email
        this.firstName = response.data.firstname
        this.lastName = response.data.lastname
      })
      .catch( (error) => {
        console.log(error)
      });
  },
  computed:{
    new_pswd()  {
     return this.translate('new_pswd')
    },
    old_pswd()  {
     return this.translate('old_pswd')
    },
    confirm_password()  {
     return this.translate('confirm_password')
    },
  },
  data(){
    return {
      note: "This is " + this.$route.params.username + "'s profile page!!",
      stalker: false,
      headers: {
          'access-token': localStorage.getItem('token'),
          'client': localStorage.getItem('client'),
          'expiry': localStorage.getItem('expiry'),
          'token-type': localStorage.getItem('token-type'),
          'uid': localStorage.getItem('uid'),
          'Content-Type': 'application/json'
        },
      userName: "",
      email: "",
      firstName: "",
      temp_first: "",
      lastName: "",
      temp_last: "",
      userSuccessClass: '',
      userSubmitBtnDisabled: true,
      emailSuccessClass: '',
      emailSubmitBtnDisabled: true,
      firstNameSuccessClass: '',
      lastNameSuccessClass: '',
      nameSubmitBtnDisabled: true,
      crtPwdSuccessClass: '',
      newPwdSuccessClass: '',
      cfmPwdSuccessClass: '',
      pwdSubmitBtnDisabled: true,
      submitBtnDisabled: true

    }
  },
  methods: {
    addPicture: function(form) {
      console.log("H E R E")
      console.log(form)
      this.picture = form.picture
      if (this.picture)
        this.submitBtnDisabled = false
      else{
        this.submitBtnDisabled = true
      } 
    },
    setLocalStorage: function(response){
      localStorage.setItem('token', response.headers['access-token'])
      localStorage.setItem('client', response.headers['client'])
      localStorage.setItem('expiry', response.headers['expiry'])
      localStorage.setItem('token-type', response.headers['token-type'])
      localStorage.setItem('uid', response.headers['uid'])
      localStorage.setItem('id', response.data.data['id'])
      localStorage.setItem('email', response.data.data['email'])
      localStorage.setItem('picture', response.data.data['picture'])
      localStorage.setItem('firstname', response.data.data['firstname'])
      localStorage.setItem('lastname', response.data.data['lastname'])
      localStorage.setItem('username', response.data.data['username'])
    },
    checkUserValidation: function(){
      if(this.$refs.txtUser.checkValidity()){
        this.userSuccessClass = "has-success"
        this.userSubmitBtnDisabled = false
      } else {
        this.userSuccessClass = "has-error"
        this.userSubmitBtnDisabled = true
      }
    },
    submitUsername: function(){
      axios({
        method: 'put',
        url: signUpUrl,
        headers: this.headers,
        data: {
          'username': this.$refs.txtUser.value
        }
      })
      .then( (response) => {
        this.setLocalStorage(response)
        let new_url = "/user/" + this.$refs.txtUser.value
        this.userName = this.$refs.txtUser.value
        this.$refs.txtUser.value = ''
        this.userSuccessClass = ''
        this.userSubmitBtnDisabled = true
        this.$router.replace(new_url)
      })
      .catch( (error) => {
        console.log(error)
      });
    },
    checkEmailValidation: function(){
      if(this.$refs.txtEmail.checkValidity()){
        this.emailSuccessClass = "has-success"
        this.emailSubmitBtnDisabled = false
      } else {
        this.emailSuccessClass = "has-error"
        this.emailSubmitBtnDisabled = true
      }
    },
    submitEmail: function(){
      axios({
        method: 'put',
        url: signUpUrl,
        headers: this.headers,
        data: {
          'email': this.$refs.txtEmail.value
        }
      })
      .then( (response) => {
        this.setLocalStorage(response)
        this.email = this.$refs.txtEmail.value
        this.$refs.txtEmail.value = ''
        this.emailSuccessClass = ''
        this.emailSubmitBtnDisabled = true
      })
      .catch( (error) => {
        console.log(error)
      });
    },
    checkFirstNameValidation: function(){
      if(this.$refs.txtFirstName.checkValidity()){
        this.firstNameSuccessClass = "has-success"
        this.nameSubmitBtnDisabled = false
      } else {
        this.firstNameSuccessClass = "has-error"
        this.nameSubmitBtnDisabled = true
      }
    },
    checkLastNameValidation: function(){
      if(this.$refs.txtLastName.checkValidity()){
        this.lastNameSuccessClass = "has-success"
        this.nameSubmitBtnDisabled = false
      } else {
        this.lastNameSuccessClass = "has-error"
        this.nameSubmitBtnDisabled = true
      }
    },
    submitName: function(){
      if (this.$refs.txtFirstName.value == ''){
        this.temp_first = this.firstName
      } else{
        this.temp_first = this.$refs.txtFirstName.value
      }
      if (this.$refs.txtLastName.value == ''){
        this.temp_last = this.lastName
      } else{
        this.temp_last = this.$refs.txtLastName.value
      }

      axios({
        method: 'put',
        url: signUpUrl,
        headers: this.headers,
        data: {
          'firstname': this.temp_first,
          'lastname': this.temp_last
        }
      })
      .then( (response) => {
        this.setLocalStorage(response)
        this.firstName = localStorage.getItem('firstname')
        this.lastName = localStorage.getItem('lastname')
        this.$refs.txtFirstName.value = ''
        this.$refs.txtLastName.value = ''
        this.firstNameSuccessClass = ''
        this.lastNameSuccessClass = ''
        this.temp_first = ''
        this.temp_last = ''
        this.nameSubmitBtnDisabled = true
      })
      .catch( (error) => {
        console.log(error)
      });
    },
    crtPwdValidation: function(){
      if(this.$refs.txtCrtPwd.checkValidity()){
        this.crtPwdSuccessClass = "has-success"
        if (this.checkAllValidation() == true){
          this.pwdSubmitBtnDisabled = false
        }
      } else {
        this.crtPwdSuccessClass = "has-error"
        this.pwdSubmitBtnDisabled = true
      }
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
    checkAllValidation: function(){
      if(this.$refs.txtCrtPwd.checkValidity() 
        && this.$refs.txtNewPwd.checkValidity()
        && this.$refs.txtCfmPwd.checkValidity())
        return true
      else
        return false
    },
    submitPwd: function(){
      axios({
        method: 'put',
        url: signUpUrl,
        headers: this.headers,
        data: {
          'current_password': this.$refs.txtCrtPwd.value,
          'password': this.$refs.txtNewPwd.value,
          'password_confirmation': this.$refs.txtCfmPwd.value,
        }
      })
      .then( (response) => {
        this.setLocalStorage(response)
        this.$refs.txtCrtPwd.value = ''
        this.$refs.txtNewPwd.value = ''
        this.$refs.txtCfmPwd.value = ''
        this.crtPwdSuccessClass = ''
        this.newPwdSuccessClass = ''
        this.cfmPwdSuccessClass = ''
        this.pwdSubmitBtnDisabled = true
      })
      .catch( (error) => {
        console.log(error)
      });
    }

  }
}
</script>

<style scoped>
  .card {
    border: 1px solid rgba(0,0,0,.125);
    border-radius: .25rem;
    margin-bottom: 5px;
  }
  .card-header{
    background-color: rgba(241,241,241,.125);
    border: 1px solid rgba(0,0,0,.125);
    border-radius: .25rem;
  }
  a {
    text-decoration: none;
    color: #555;
  }

  input {
    margin: 5px auto 5px auto;
  }
  .uploadfile{
    margin: 5px 5px 5px 5px;
  }

</style>