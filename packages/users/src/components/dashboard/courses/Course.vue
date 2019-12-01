<template>
  <v-container>
      <h2>Roger, you can start writing your code here.</h2>
      <h3>Course id {{course_id}}</h3>
      <h3>See Admin Course for reference</h3>
  </v-container>
</template>


<script>
export default {
  data: () => ({
    course_id: "",
  }),
  created() {
    this.course_id = this.$route.params.id;
  },
};
</script>