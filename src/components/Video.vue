<template>
  <div class="video">
    <h1>Video Page</h1>
    {{note}}
  </div>
</template>

<script>
export default{
  name: 'video',
  data(){
    return {
      note: "This is the Streaming page !"
    }
  }
}
</script>