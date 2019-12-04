<template>   
    <v-container class="mt-1">
    <v-skeleton-loader class="fill-height fill-width" v-if="loading" type="card"></v-skeleton-loader>  
        <v-hover v-slot:default="{ hover }">
            <!-- <v-card v-if="!loading" class="mx-auto ma-3" max-width="250">  -->
            
            <v-card class="mx-auto ma-3" max-width="270">  
              <v-card class="thumbnail"   hoverS:elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }" >
                  <v-img  @click.stop.prevent="toCourse(course.course_id)" 
                    :src="course.thumbnail.key"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                  ></v-img>
              </v-card>
              <v-card-title>{{course.course_name}}</v-card-title>
              <!-- <v-card-subtitle>Instructor: {{course.instructor}}</v-card-subtitle>
              <v-card-text>updated: {{course.updated_at}}</v-card-text> -->
              <v-card-actions>
                    <v-btn text @click="expand = !expand">Description</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>

              <v-expand-transition>
                  <v-card v-show="expand" class="pb-2 pr-2 pl-2 pt-2">
                    <p>{{course.excerpt}}</p>
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

    }),
    methods: {
       toCourse(course) {
          this.loading=true
          if(course)
              this.$router.push(`/dashboard/courses/${course}`)
        },
    }
}
</script>

<style lang="scss" scoped>
.v-card {
  transition: opacity .4s ease-in-out;
}

.thumbnail:not(.on-hover) {
  opacity: 1.0;
 }

.thumbnail.on-hover {
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

