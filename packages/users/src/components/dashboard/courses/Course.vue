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
            <v-toolbar-title>{{course.course_name}}</v-toolbar-title>
          <v-spacer />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
              :loading="isSubscribing"
              v-bind:color="isSubscribed()===false ? 'success' : 'warning'"
              @click="toggleSubscribe()">
                <span class="hidden-sm-and-down" left>{{subscribe_btn.label}}</span>
              </v-btn>
            </template>
          </v-tooltip>
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
                <v-list-item-title>Course Description:</v-list-item-title>
                <v-list-item-subtitle>{{course.excerpt}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <!-- <v-list-item-title>Thumbail:</v-list-item-title> -->
                <v-img max-width="250px" :src="course.thumbnail.url"></v-img>
              </v-list-item-content>
            </v-list-item>

            <v-list-item class="pl-0 pr-0" two-line>
              <v-list-item-content>
                  <v-list-item-title>Lectures:</v-list-item-title>
                  <v-card
                    class="mt-1"
                    v-for="(lecture, index) of course.lectures"
                    :key="index"
                    outlined
                    flat
                  >
                    <v-card-text class="pl-0 pr-0">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title>#{{index + 1}} Lecture Name:</v-list-item-title>
                          <v-list-item-subtitle>{{lecture.name}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title>Lecture description:</v-list-item-title>
                          <v-list-item-subtitle>{{lecture.description}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-subheader class="pl-0 pr-0">Lecture File:</v-subheader>
                          <v-list-item-subtitle v-for="(file, i) in lecture.files" :key="i"> 
                            <v-btn class="mt-1" @click="goToLecture(file, index)" outlined>
                              <v-icon
                                left
                              >{{(file.realName.split(".")[1] === 'mp4') ? "fa-video" : "fa-chess"}}</v-icon>
                              {{file.realName}}
                            </v-btn>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card-text>
                  </v-card>
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
    loading: false,
    isSubscribing: false,
    subscribe_btn: {
        label: 'Subscribe'
    }
  }),
  created() {
    this.course_id = this.$route.params.id;
    this.getCourseDetails();
  },
  methods: {
    async getCourseDetails() {
      this.loading = true;
      try {
          let apiName= "CyberChessApi";
          let dynamoKey= `/courses/user/${this.course_id}`; 
          // console.log("dynamoKey: " + dynamoKey);
          const response= await this.$Amplify.API.get(apiName, dynamoKey);
          //console.log(response); 
          let thumbUrl = await this.$Amplify.Storage.get(response[0].thumbnail.key, {
            level: 'protected',identityId :response[0].instructor_id
          });
          // get thumbnail address from S3 bucket to CloudFront
          // console.log("--->" + thumbUrl)
          response[0].thumbnail.url = this.$CyberChess.getCloudUrl(thumbUrl);
          // console.log("--->" + response[0].thumbnail.url)
          // get lectures
          this.course = response[0];
          // console.log(this.course.lectures);
          this.loading = false;
      } catch (err) {
          swal("Sorry!", "Looks like something went wrong", "error");
          console.log(err);
          this.$router.go(-1)
      }
    },
    back() {
      this.$router.go(-1);
    },
    async goToLecture(file, index) {
      // console.log(file.realName);
      console.log(JSON.stringify({l:this.course.lectures[index], il: this.course.is_listed, k:file.key}));
      let f = file.realName.split(".");
      console.log(f[1]);
      switch (f[1]) {
        case "pdf": {
          let url = await this.$Amplify.Storage.get(file.key, {
            level:  'protected', identityId : this.course.instructor_id  
          });
          // console.log(url);
          window.open(this.$CyberChess.getCloudUrl(url),"_blank");
          break;
        }
        case "mp4": {
            console.log("--->>")
            console.log(this.course.lectures[index]);
            await window.sessionStorage.setItem('lecture', JSON.stringify({l:this.course.lectures[index], il: this.course.is_listed, k:file.key, id:this.course.instructor_id}));
            this.$router.push({name: 'Lecture'});
            break;
        }
        default:
          break;
      }
    },
    async subscribe() {
      try {
        this.isSubscribing = true;
        let subscription = {};
        subscription.profile_id = await this.$Amplify.Auth.currentSession();
        subscription.profile_id = subscription.profile_id.idToken.payload.sub;
        subscription.course_id = this.course_id;
        subscription.is_deleted = false;
        const result = await this.$Amplify.API.post("CyberChessApi", "/subscriptions", {
            body: { ...subscription }
        });
        console.log("Subscription succeed:");
        console.log(result);
        this.subscription = {};
        this.isSubscribing = false;
        swal('Success', 'Congratulations! you subscribed to this course.', 'success')
      } catch (err) {
        console.log(err);
        swal(
            "Sorry!",
            "There was an error while subscribing the course. Please try again.",
            "error"
        )
      }
    },
    toggleSubscribe() {
      if (this.isSubscribed()) {
        this.unsubscribe();
      } else {
        this.subscribe();
      }
    },
    isSubscribed() {
      this.subscribe_btn.label = "Subscribe"
      return false;
    }
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