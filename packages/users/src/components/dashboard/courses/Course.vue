<template>
  <v-container class="fill-height mt-8">
    <v-skeleton-loader class="fill-height fill-width" v-if="loading" type="card"></v-skeleton-loader>
    <v-card v-if="!loading"  class="fill-height fill-width">
    </v-card>
  </v-container>
</template>

<script>
import swal from "sweetalert";
import UpdateCourse from "./UpdateCourse.vue";
export default {
  data: () => ({
    course_id: "",
    course: {},
    baseUrl: "",
    loading: false
  }),
  components: {
    UpdateCourse
  },
  created() {
    this.course_id = this.$route.params.id;
    this.getCourseDetails();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    
     courseUpdated() {
      swal({
        title: "Updated Succesfully",
        icon: "success"
      });
      this.getCourseDetails();
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