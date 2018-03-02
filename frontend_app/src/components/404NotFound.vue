<template>
	<div class="notFound">
		<div class="row">
			<div class="col-md-6 col-md-offset-3">
			<p class="alert alert-danger" role="alert"> <strong>404</strong> - Page Not Found ! </p>
			</div>
			

			<div class="col-md-6 col-md-offset-3">
			<img src="static/img/404-not-found.png">
			</div>
		</div>
	</div>		
</template>

<script>
export default{
  name: 'notFound'
}

</script>

<style scoped >

img {
	width: 100%;
	padding : 10px 10px 10px 10px;

}

</style>