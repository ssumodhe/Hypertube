<template>
  <div class="signin">
    
    <span>{{note}}</span>

    <form @submit.prevent="submitSignIn">
    	<div class="form-group has-feedback has-success">
    		<label for="email" class="control-label sr-only">
    			email address
    		</label>
    		<input type="email" id="email" class="form-control" name="email" placeholder="Email." required>
    		<span class="glyphicon glyphicon-ok form-control-feedback"></span>
    	</div>

    	<div class="form-group has-feedback has-error">
    		<label for="password" id="password" class="control-label sr-only">
    			secret password
    		</label>
    		<input type="password" class="form-control" name="password" placeholder="Password." required>
    		<span class="glyphicon glyphicon-remove form-control-feedback"></span>
    		<small><mark>
    		Your password needs to be at least 6 chars long.
    		<br> With lower and upper cases and digits.
    		</mark></small>
    	</div>

    	<input class="btn btn-default" type="submit" value="Sign In!">
    </form>

  </div>
</template>

<script>
export default{
  name: 'signin',
  data(){
    return {
      note: "Form sign In here"
    }
  },
  methods: {
  	submitSignIn: function() {
  		// submit here
  	}

  }
}
</script>