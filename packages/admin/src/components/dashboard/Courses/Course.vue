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
            <update-course :courseVal="course" v-on:course-updated="courseUpdated" />
          </template>
          <span>Edit Course</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn @click="deleteCourse" icon v-on="on">
              <v-icon>fa-trash</v-icon>
            </v-btn>
          </template>
          <span>Delete Course</span>
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
                <v-list-item-title>Thumbail:</v-list-item-title>
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
                    <v-list-item three-line>
                      <v-list-item-content>
                        <v-subheader class="pl-0 pr-0">Lecture #{{index}}</v-subheader>
                        <v-divider />
                        <v-list-item-title>Lecture Name:</v-list-item-title>
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
                        <v-subheader class="pl-0 pr-0">Lecture Files:</v-subheader>
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
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title>Lecture Status:</v-list-item-title>
                        <v-list-item-subtitle>{{lecture.is_listed ? "Listed" : "Unlisted"}}</v-list-item-subtitle>
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
    async getCourseDetails() {
      this.loading = true;
      try {
        let response = await this.$Amplify.API.get(
          "CyberChessApi",
          `/courses/object/${this.course_id}`
        );
        let thumbUrl = await this.$Amplify.Storage.get(response.thumbnail.key, {
          level: response.is_listed ? "protected" : "private"
        });
        // get thumbnail
        response.thumbnail.url = this.$CyberChess.getCloudUrl(thumbUrl);
        // get lectures
        console.log(response.lectures);
        this.course = response;
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
    deleteCourse() {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to access this course again.",
        icon: "warning",
        dangerMode: true,
        buttons: true
      }).then(async del => {
        if (del) {
          const resp = await this.$Amplify.API.del(
            "CyberChessApi",
            `/courses/object/${this.course.course_id}`
          );
          console.log(resp);
          swal(
            "Deleted",
            "Your course has been deleted successfully",
            "success"
          );
          this.$router.push("/dashboard/courses");
        }
      });
    },
    async goToLecture(file, index) {
      let f = file.realName.split(".");
      console.log(f[1]);
      switch (f[1]) {
        case "pdf": {
          let url = await this.$Amplify.Storage.get(file.key, {
            level: this.course.is_listed ? "protected" : "private"
          });
          url = await this.$CyberChess.getCloudUrl(url)
          console.log(window, url)
          window.open(url ,"_blank", true);
          break;
        }
        case "mp4": {
            await window.sessionStorage.setItem('lecture', JSON.stringify({l:this.course.lectures[index], il: this.course.is_listed, k:file.key}));
            this.$router.push({name: 'Lecture'});
            break;
        }
        default:
          break;
      }
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