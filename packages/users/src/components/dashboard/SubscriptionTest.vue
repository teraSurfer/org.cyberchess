<template>
    <v-container class="user-subscription mt-1 pl-1 pr-1">
      <p p class="font-weight-bold display-1 text-justify"> Subscription </p>
      <v-btn :loading="isSubscribed" 
         value="Subscribe" 
         class="ml-2" 
         v-on="on" 
         color="success" 
         type="submit" 
         @click="subscribe">
          <span class="hidden-sm-and-down" left>Subscribe</span>
      </v-btn>
   </v-container>
</template>

<script>
import swal from "sweetalert";
export default {
   data: () => ({
      isSubscribed: false,
      loading: false
   }),
   methods: {
      test() {
        console.log('tita');
      },
      async subscribe() {
         console.log("⚽️");
         try {
            let subscription = {};
            subscription.profile_id = "210983092";
            subscription.course_id = "2938409234";
            subscription.is_deleted = false;
            await this.$Amplify.API.post("CyberChessApi", "/subscriptions", {
               body: { ...subscription }
            });
            this.isSubscribed = true;
            this.subscription = {};
         } catch (err) {
            console.log(err);
            swal(
               "Sorry!",
               "There was an error while subscribing the course. Please try again.",
               "error"
            )
         }
      }
   },
   watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 3000)

        this.loader = null
      },
    },
}
</script>
<style lang="scss" scoped>

</style>