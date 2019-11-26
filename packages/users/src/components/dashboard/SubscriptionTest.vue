<template>
    <v-container class="user-subscription mt-1 pl-1 pr-1">
      <p p class="font-weight-bold display-1 text-justify"> Subscription </p>
      <v-btn :loading="isSubscribing" 
         value="Subscribe" 
         class="ml-2"  
         v-bind:color="isSubscribed()===false ? 'success' : 'warning'"
         type="submit" 
         @click="toggleSubscribe()">
          <span class="hidden-sm-and-down" left>{{subscribeBtn.label}}</span>
      </v-btn>
   </v-container>
</template>

<script>
import swal from "sweetalert";
export default {
   data: () => ({
      isSubscribing: false,
      loading: false,
      subscribeBtn: {
         label: 'Subscribe'
      }
   }),
   methods: {
      async subscribe() {
         try {
            this.isSubscribing = true;
            let subscription = {};
            subscription.profile_id = await this.$Amplify.Auth.currentSession();
            subscription.profile_id = subscription.profile_id.idToken.payload.sub;
            subscription.course_id = "2938409234";
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
         this.subscribeBtn.label = "Subscribe"
         return false;
      }
   }
}
</script>
<style lang="scss" scoped>
</style>