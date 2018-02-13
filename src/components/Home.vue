<template>
  <div class="home">
    <h1>Home Page</h1>
    {{note}}
  </div>
</template>

<script>
export default{
  name: 'home',
  data(){
    return {
      note: "This is the Home page Where all videos will be displayed"
    }
  }
}
</script>