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
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
            :loading="isSubscriptionLoading"
            v-bind:color="isSubscribed()===false ? 'success' : 'warning'"
            @click="toggleSubscribe()">
              <span class="hidden-sm-and-down" left>{{isSubscribed() ? "Unsubscribe" : "Subscribe"}}</span>
              <v-icon class="hidden-md-and-up">{{isSubscribed() ? "fa-minus" : "fa-plus"}}</v-icon>
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
                <v-list-item-title>Thumbnail:</v-list-item-title>
                <v-img max-width="250px" :src="course.thumbnail.key"></v-img>
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
    loading: false,
    isSubscriptionLoading: false,
    courseSubscription: null,
    profile_id: null
  }),
  created() {
    this.course_id = this.$route.params.id;
    this.getCourseDetails();
    this.getProfileId();
    this.getCourseSubscriptionObject();
  },
  methods: {
    async getProfileId() {
      let id = await this.$Amplify.Auth.currentSession()
      id = id.idToken.payload.sub
      this.profile_id = id
    },
    async getCourseSubscriptionObject() {
      const response = await this.$Amplify.API.get(
        "CyberChessApi",
        `/subscriptions/course_id/${this.course_id}`
      );
      let profile_id = this.profile_id
      const subscriptions = response.filter(function(subscription){
        return subscription.is_deleted == false && subscription.profile_id == profile_id
      })
      if (Object.keys(subscriptions[0]).length !== 0) {
        this.courseSubscription = subscriptions[0]
      }
    },
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
        response.thumbnail.key = this.$CyberChess.getCloudUrl(thumbUrl);
        console.log(response.lectures);
        this.course = response;
        this.loading = false;
        return response.thumbnail.key
      } catch (err) {
        swal("Sorry!", "Looks like something went wrong", "error");
        console.log(err);
        this.$router.go(-1)
      }
    },
    
    back() {
      this.$router.go(-1);
    },
    async subscribe() {
      this.isSubscriptionLoading = true;
      try {
        let newSubscription = {};
        newSubscription.profile_id = this.profile_id
        newSubscription.course_id = this.course_id;
        newSubscription.is_deleted = false;
        const result = await this.$Amplify.API.post(
          "CyberChessApi", 
          "/subscriptions", 
          {body: { ...newSubscription }}
        );
        console.log("🟢Subscription succeed:");
        console.log(result)
        this.getCourseSubscriptionObject()
        swal('Success', 'Congratulations! you subscribed to this course.', 'success')
      } catch (err) {
        console.log(err);
        swal(
            "Sorry!",
            "There was an error while subscribing the course. Please try again.",
            "error"
        )
      }
      this.isSubscriptionLoading = false;
    },
    async unsubscribe() {
      if (this.courseSubscription) {
        this.isSubscriptionLoading = true;
        try {
          let subscription_id = this.courseSubscription.subscription_id
          console.log(this.courseSubscription)
          const result = await this.$Amplify.API.del(
            "CyberChessApi",
            `/subscriptions/object/${subscription_id}`
          );
          console.log("🟢Unsubscription succeed:");
          console.log(result)
          swal('Success', 'You unsubscribed from this course.', 'success')
          this.courseSubscription = null
        } catch (err) {
          console.log(err);
          swal(
              "Sorry!",
              "There was an error while subscribing the course. Please try again.",
              "error"
          )
        }
        this.isSubscriptionLoading = false;
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
      if (this.courseSubscription != null) {
        return true
      } else {
        return false
      }
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