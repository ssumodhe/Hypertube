<template>
  <div class="user">
    <h1>User Page</h1>
    {{note}}

    <div class="row">
      <div class="col-md-2 col-md-offset-3">
        <div class="card">
            <div class="card-header" role="tab" id="headingZero">
              <h5 class="mb-0">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapseZero" aria-expanded="true" aria-controls="collapseZero">
                  <img class="img-circle" src="/static/img/emoji_kitty.png" width="100px">
                </a>
              </h5>
            </div>
            <div id="collapseZero" class="collapse show" role="tabpanel" aria-labelledby="headingZero">
              <div class="card-block">
                <uploadfile class="uploadfile"></uploadfile>
              </div>
            </div>
          </div>
      </div>

      <div class="col-md-5">
        <div id="accordion" role="tablist" aria-multiselectable="true">
          <div class="card">
            <div class="card-header " role="tab" id="headingOne">
              <h5 class="mb-0 ">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  <span class="glyphicon glyphicon-user"></span>
                  <p>Username</p>
                </a>
              </h5>
            </div>
            <div id="collapseOne" class="collapse show" role="tabpanel" aria-labelledby="headingOne">
              <div class="card-block">
                
                <form>
                  <input type="text" name="username" placeholder="the_user's_name">
                </form>





              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" role="tab" id="headingTwo">
              <h5 class="mb-0">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  <span class="h4"><strong>@</strong></span>
                  <p>Email</p>
                </a>
              </h5>
            </div>
            <div id="collapseTwo" class="collapse" role="tabpanel" aria-labelledby="headingTwo">
              <div class="card-block">
                Modif input
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" role="tab" id="headingThree">
              <h5 class="mb-0">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  <span class="glyphicon glyphicon-tags"></span>
                  <p>FirstName + LastName</p>
                </a>
              </h5>
            </div>
            <div id="collapseThree" class="collapse" role="tabpanel" aria-labelledby="headingThree">
              <div class="card-block">
                Modif input firstName + lastName
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" role="tab" id="headingFour">
              <h5 class="mb-0">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                  <span class="glyphicon glyphicon-lock"></span>
                  <p>Password</p>
                </a>
              </h5>
            </div>
            <div id="collapseFour" class="collapse" role="tabpanel" aria-labelledby="headingFour">
              <div class="card-block">
                Modif 
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

export default{
  name: 'user',
  components:{
    Uploadfile
  },
  data(){
    return {
      note: "This is the Profile page!!"
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

  form {
    padding: 5px auto 5px auto;
  }
  .uploadfile{
    padding-top: 5px;
  }

</style>