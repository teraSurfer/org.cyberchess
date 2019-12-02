<template>
  <v-container class="fill-height mt-8">
    <v-skeleton-loader class="fill-height fill-width" v-if="loading" type="card"></v-skeleton-loader>
    <v-card v-if="!loading" flat class="fill-height fill-width">
      <v-toolbar dense elevation="1">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn @click="back" icon v-on="on">
              <v-icon>fa-arrow-left</v-icon>
            </v-btn>
          </template>
          <span>Back</span>
        </v-tooltip>
        <v-spacer />
        <v-toolbar-title>{{course.name}}</v-toolbar-title>
        <v-spacer />
        </v-toolbar>
      <v-card-text>
        <v-card class="all-courses" outlined flat>
          <v-card-text>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Course Title:</v-list-item-title>
                <v-list-item-subtitle>{{course.course_name}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Course ID:</v-list-item-title>
                <v-list-item-subtitle>{{course.course_id}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Course Description:</v-list-item-title>
                <v-list-item-subtitle>{{course.excerpt}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Thumbail:</v-list-item-title>
                <v-img max-width="250px" :src="course.thumbnail.url"></v-img>
              </v-list-item-content>
            </v-list-item>
            </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import swal from "sweetalert";

export default {
  data: () => ({
    course_id: "",
    course: {},
    baseUrl: "",
    loading: false
  }),
  components: {
    
  },
  created() {
    this.course_id = this.$route.params.id;
    this.loadBaseUrl();
    this.getCourseDetails();
  },
  methods: {
    async getCourseDetails() {
      this.loading = true;
      try {
        let response = await this.$Amplify.API.get(
          "CyberChessApi",
          `/courses/object/${this.course_id}`
        );
        console.log(response)
        let thumbUrl = await this.$Amplify.Storage.get(response.thumbnail.key, {
          level: 'protected',identityId: response.instructor_id
        });
        // get thumbnail
        response.thumbnail.url = thumbUrl
          .split(
            "https://" +
              this.$Amplify.Storage._config.AWSS3.bucket +
              ".s3.amazonaws.com"
          )
          .join(this.baseUrl);

        
        console.log(response.lectures);
        this.course = response;
        this.loading = false;
      } catch (err) {
        swal("Sorry!", "Looks like something went wrong", "error");
        console.log(err);
        this.$router.go(-1)
      }
    },
    loadBaseUrl() {
      const urls = {
        dev: "https://d15qyykdkts3kc.cloudfront.net",
        jhrenv: "https://d217hs3emk80ln.cloudfront.net"
      };
      let bucketName = this.$Amplify.Storage._config.AWSS3.bucket;
      let env = bucketName.split("-");
      this.baseUrl = urls[env[env.length - 1]];
    },
    back() {
      this.$router.go(-1);
    },
    
}
};
</script>

<style lang="scss" scoped>
.all-courses {
  height: 65vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.fill-width {
  width: 100%;
}
</style>