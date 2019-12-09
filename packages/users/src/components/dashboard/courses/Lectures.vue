<template>
  <v-container class="fill-height dashboard mt-8 all-courses align-start justify-center">
        <v-card class="fill-width">
            <v-toolbar dense elevation="1">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn @click="back" icon v-on="on">
              <v-icon>fa-arrow-left</v-icon>
            </v-btn>
          </template>
          <span>Back</span>
        </v-tooltip>
            </v-toolbar>
        <video-player v-if="url !== ''" :url="url" />
        <v-card-text>
            <h3 class="white--text">{{(lecture !== '') ? lecture.l.name.toUpperCase() : ''}}</h3>
            <p>{{(lecture !== '') ? lecture.l.description : ''}}</p>
        </v-card-text>
        </v-card>
  </v-container>
</template>

<script>
import VideoPlayer from "@/components/common/VideoPlayer.vue";
export default {
  components: {
    VideoPlayer
  },
  data: () => ({
    lecture: "",
    url: "",
  }),
  async created() {
    this.lecture = await window.sessionStorage.getItem("lecture");
    // console.log(this.lecture) //Key info torun video 
    this.lecture = JSON.parse(this.lecture);
    // console.log(this.lecture.id)   //instructor id
    let u = await this.$Amplify.Storage.get(this.lecture.k, {
      level: 'protected' , identityId : this.lecture.id   
    });
    this.url = this.$CyberChess.getCloudUrl(u);
  },
  methods: {
    back() {
        this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.all-courses {
  height: 75vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.fill-width{
    width: 100%;
}
</style>