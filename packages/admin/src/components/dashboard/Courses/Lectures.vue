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
    baseUrl: ""
  }),
  async created() {
    this.loadBaseUrl()
    this.lecture = await window.sessionStorage.getItem("lecture");
    this.lecture = JSON.parse(this.lecture);
    let u = await this.$Amplify.Storage.get(this.lecture.k, {
      level: this.lecture.il ? "protected" : "private"
    });
    this.url = u.split(
      "https://" +
        this.$Amplify.Storage._config.AWSS3.bucket +
        ".s3.amazonaws.com"
    ).join(this.baseUrl);
    console.log(this.url)
  },
  methods: {
      loadBaseUrl() {
      const urls = {
        dev: "https://d15qyykdkts3kc.cloudfront.net",
        achalaesh: "https://dd0fq9p45tg50.cloudfront.net"
      };
      let bucketName = this.$Amplify.Storage._config.AWSS3.bucket;
      let env = bucketName.split("-");
      this.baseUrl = urls[env[env.length - 1]];
    },
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