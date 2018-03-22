<!-- Source: -->
<!-- https://alligator.io/vuejs/uploading-vue-picture-input/ -->
<!-- https://github.com/alessiomaffeis/vue-picture-input -->

<template>
  <div class="uploadfile">
    <picture-input
        ref="pictureInput"
        @change="onChanged"
        @remove="onRemoved"
        :width="500"
        :removable="true"
        removeButtonClass="ui red button"
        :height="500"
        accept="image/jpeg, image/png, image/gif"
        buttonClass="ui button primary"
        :customStrings="{
        upload: '<h1>Upload it!</h1>',
        drag: 'Drag and drop your profile picture here'}">

      </picture-input>
  </div>
</template>

<script>
import PictureInput from 'vue-picture-input'

export default{
  name: 'uploadfile',
  data(){
    return {
    }
  },
  components:{
    PictureInput
  },
  methods:{
    onChanged() {
      if (this.$refs.pictureInput.file) {
        this.$emit('uploadedPicture',
          {
            'picture': this.$refs.pictureInput.image,
          }
        )
      } else {
        console.log("Old browser. No support for Filereader API");
      }
    },
    onRemoved() {
      this.image = '';
    },
    attemptUpload() {
      if (this.image){
        FormDataPost('http://localhost:8001/user/picture', this.image)
          .then(response=>{
            if (response.data.success){
              this.image = '';
              console.log("Image uploaded successfully ✨");
            }
          })
          .catch(err=>{
            console.error(err);
          });
      }
    }
  }
}
</script>

<style scoped>
  .uploadfile {
    margin-bottom: 20px;
    z-index: 0; 
    position: relative;
  }
</style>