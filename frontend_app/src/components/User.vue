<template>
  <div class="user">
    <h1>User Page</h1>
    {{note}}
  </div>
</template>

<script>
export default{
  name: 'user',
  data(){
    return {
      note: "This is the Profile page!!"
    }
  }
}
</script>