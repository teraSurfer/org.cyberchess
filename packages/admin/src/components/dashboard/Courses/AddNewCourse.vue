<template>
  <v-row class="mr-4">
    <v-spacer />
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-btn value="Create Course" class="ml-2" v-on="on">
          <span class="hidden-sm-and-down" left>Create Course</span>
          <span class="hidden-md-and-up" left>New</span>
          <v-icon right>fa-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar>
          <v-btn icon @click="dialog = false">
            <v-icon>fa-times</v-icon>
          </v-btn>
          <v-toolbar-title>Create New Course</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-container>
          <v-stepper v-model="courseStepper">
            <v-stepper-header>
              <v-stepper-step color="info" :complete="courseStepper > 1" step="1">Course Details</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step color="info" :complete="courseStepper > 2" step="2">Add Lectures</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step color="info" step="3">Finalize Course</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items class="mt-2">
              <v-stepper-content step="1">
                <v-form
                  @submit.stop.prevent="handleCourseDetailsSubmit"
                  class="text-center mb-2"
                  v-model="course.valid"
                >
                  <v-text-field
                    label="Course Name"
                    v-model="course.name"
                    required
                    :rules="rules.nameRules"
                    :counter="20"
                  ></v-text-field>
                  <v-textarea
                    class="mt-2"
                    label="Course Description"
                    v-model="course.excerpt"
                    :counter="200"
                    :rules="rules.descriptionRules"
                    required
                    outlined
                  ></v-textarea>
                  <v-btn outlined type="submit" :disabled="!course.valid">
                    <span left>Next</span>
                    <v-icon right>fa-chevron-right</v-icon>
                  </v-btn>
                </v-form>
              </v-stepper-content>
              <v-stepper-content step="2" class="lectures-box">
                <lecture
                  v-on:cyb-back="backRequested(1)"
                  v-on:form-submitted="handleLecturesSubmit($event)"
                  :l="course.lectures.lectureList"
                  class="justify-center"
                />
              </v-stepper-content>
              <v-stepper-content step="3" class="lectures-box">
                <review-course v-on:course-created="courseCreated" v-on:cyb-back="backRequested(2)" :c="course"></review-course>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Lecture from './Lecture.vue';
import ReviewCourse from './ReviewCourse.vue';
// import _ from 'lodash';
export default {
  data() {
    return {
      dialog: false,
      courseStepper: 0,
      course: {
        name: "",
        excerpt: "",
        thumbnail: null,
        listed: false,
        valid: false,
        lectures: {
          lectureList: [],
          valid: false
        }
      },
      rules: {
        nameRules: [
          v => !!v || "Course name is required",
          v =>
            v.length <= 20 || "Course name cannot be greater than 20 characters"
        ],
        descriptionRules: [
          v => !!v || "Course description is required",
          v =>
            v.length <= 200 ||
            "Course name cannot be greater than 200 characters"
        ]
      }
    };
  },
  mounted() {},
  methods: {
    handleCourseDetailsSubmit() {
      if (this.course.valid) {
        this.courseStepper = 2;
      }
    },
    handleLecturesSubmit(evt) {
      this.course.lectures.lectureList = evt
      this.courseStepper = 3;
      console.log(this.course)
    },
    backRequested(num) {
      this.courseStepper = num;
    },
    courseCreated() {
      this.$emit('course-created')
      this.dialog = false;
    }
  },
  components: {
      Lecture,
      ReviewCourse
  }
};
</script>

<style lang="scss">
.lectures-box {
  max-height: 70vh;
  overflow-y: scroll;
}
</style>