<!-- Source: -->
<!-- https://alligator.io/vuejs/uploading-vue-picture-input/ -->

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
      console.log("New picture loaded");
      if (this.$refs.pictureInput.file) {
        this.image = this.$refs.pictureInput.file;
        console.log(this.image)
        this.$emit('uploadedPicture',
          {
            'picture': this.image,
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
  }
</style>