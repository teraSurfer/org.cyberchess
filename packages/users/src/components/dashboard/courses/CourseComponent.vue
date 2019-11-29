<template>   
    <v-container class="mt-8">
    <v-skeleton-loader class="fill-height fill-width" v-if="loading" type="card"></v-skeleton-loader>  
    <!-- <v-container class="pa-4 text-center">   -->
        <v-hover v-slot:default="{ hover }">
            <v-card v-if="!loading" class="mx-auto ma-3" max-width="250"> 

              <v-card class="thumbnail" hover   :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }"  >
                  <v-img height="150px" v-bind:src="course.courseThumbnail"></v-img>
              </v-card>

              <v-card-title>{{course.courseName}}</v-card-title>
              <v-card-subtitle>{{course.courseInstructor}}</v-card-subtitle>
              <v-card-actions>
                    <v-btn text @click="expand = !expand">Details</v-btn>
                    <v-spacer></v-spacer>
                    <!-- <v-btn text @click="isSuscribed()" > {{userSubscription}} </v-btn>  -->
                </v-card-actions>

              <v-expand-transition>
                  <v-card v-show="expand" class="pb-2 pr-2 pl-2 pt-2">
                    <p>{{course.courseDetails}}</p>
                  </v-card>
              </v-expand-transition>
  
            </v-card>
        </v-hover>
    </v-container>  
</template>

<script>
export default {
    props: {
        course: Object,
    },
    data: () => ({
        expand: false,
        loading: false,
        // suscribe: false,
        // userSubscription: ""
    }),
    //  mounted() {
    //         this.course.suscribe ?  this.userSubscription = "suscribed" :  this.userSubscription = "unsuscribed";
    //         // console.log("before1  " + this.course.suscribe);
    //         // console.log("before2  " + this.userSubscription);
    //  },
    //  methods: {
    //      isSuscribed(){
    //         this.course.suscribe = ! this.course.suscribe;
    //         this.course.suscribe ?  this.userSubscription = "suscribed" :  this.userSubscription = "unsuscribed";
    //         // console.log("on click1  " + this.userSubscription)
    //         // console.log("on click1  " + this.course.suscribe)
    //     }
    //  }
}
</script>

<style lang="scss" scoped>
.v-card {
  transition: opacity .4s ease-in-out;
}

.thumbnail:not(.on-hover) {
  opacity: 0.6;
 }

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}

.course-component {
  height: 65vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.fill-width {
  width: 100%;
}

</style>

