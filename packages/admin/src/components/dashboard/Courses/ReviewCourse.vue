<template>
  <v-form @submit.stop.prevent="confirmCourse">
    <v-card v-if="c" flat>
      <v-card-title class="justify-center">Review Course Details</v-card-title>
      <v-card-text>
        <v-list two-line>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Course name:</v-list-item-title>
              <v-list-item-subtitle>{{c.name}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Course description:</v-list-item-title>
              <v-list-item-subtitle>{{c.excerpt}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-subheader>Lectures:</v-subheader>
          <v-card
            outlined
            class="mt-1"
            v-for="(lecture, index) in c.lectures.lectureList"
            :key="index"
          >
            <v-card-text>
              <v-list-item-content>
                <v-list-item-title>{{lecture.name}}</v-list-item-title>
                <v-list-item-subtitle>{{lecture.description}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-subheader>Files:</v-subheader>
              <v-list-item>
                <v-list-item-content v-for="(file, index) in lecture.files" :key="index">
                  <v-chip>{{file.name}}</v-chip>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
          </v-card>
          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="c.listed" color="info" />
            </v-list-item-action>
            <v-list-item-content>Would you like to list this couse now?</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-file-input
              v-model="c.thumbnail"
              :rules="fileRules"
              show-size
              accept=".jpg, .png, .svg"
            ></v-file-input>
            <v-list-item-subtitle>Select a thumbnail for this course</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn :loading="isSubmitted" :disabled="isSubmitted" outlined class="mr-2" @click="goBack">
          <v-icon left>fa-chevron-left</v-icon>
          <span right>Back</span>
        </v-btn>
        <v-btn :loading="isSubmitted" :disabled="isSubmitted" type="submit">
          <span left>Create course</span>
          <v-icon right>fa-chevron-right</v-icon>
        </v-btn>
        <v-dialog v-model="isSubmitted" hide-overlay persistent width="300">
          <v-card>
            <v-card-text>Uploading - {{upload.lectureName}}</v-card-text>
            <v-progress-linear :value="upload.progress"></v-progress-linear>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import swal from "sweetalert";
export default {
  props: {
    c: Object
  },
  mounted() {},
  data: () => ({
    isSubmitted: false,
    fileRules: [
      v => !!v || "Please select a thumbnail for this course",
      v => (v && v.size < 1000000) ? true : "Thumbnail cannot be over 1MB"
    ],
    upload: {
      lectureName: '',
      progress: 0
    },
  }),
  methods: {
    goBack() {
      this.$emit("cyb-back");
    },
    async confirmCourse() {
      try {
        this.isSubmitted = true;
        let course = {};
        course.thumbnail = this.cleanThumbnail(this.c.thumbnail);
        course.lectures = this.cleanLectures(this.c.lectures.lectureList);
        course.course_name = this.c.name;
        course.instructor = await this.$Amplify.Auth.currentSession();
        course.instructor = course.instructor.idToken.payload.sub;
        course.is_listed = this.c.listed;
        course.excerpt = this.c.excerpt;
        let self = this;
        course.thumbnail = await this.$Amplify.Storage.put(
          `${this.cleanName(course.name)}/${course.thumbnail.realName}`,
          course.thumbnail,
          {
            level: (course.is_listed) ? 'protected' : 'private',
            contentType: course.thumbnail.type,
            progressCallback(progress) {
              console.log(progress)
              self.upload.lectureName = 'thumbnail';
              self.upload.progress = (progress.loaded*100)/(progress.total)
            }
          }
        );
          for (let lecture of course.lectures) {
            for (let file of lecture.files) {
              let f = await this.$Amplify.Storage.put(
                `${this.cleanName(course.name)}/${this.cleanName(lecture.name)}/${file.realName}`,
                file,
                {
                  level: (course.is_listed) ? 'protected' : 'private',
                  contentType: file.type,
                  progressCallback(progress) {
                    self.upload.lectureName = lecture.name;
                    self.upload.progress = progress.loaded*100/progress.total
                  }
                }
              );
              console.log(f);
              file = f.key;
            }
          }
          await this.$Amplify.API.post("CyberChessApi", "/courses", {
            body: { ...course }
          });
          this.isSubmitted = false;
          this.$emit("course-created");
          this.course = {}
      } catch (err) {
        console.log(err);
        swal(
          "Sorry!",
          "There was an error while creating the course. Please try again.",
          "error"
        );
      }
    },
    cleanLectures(lectureList) {
      let lecList = lectureList.map(lecture => {
        let lec = { ...lecture };
        lec.files = lecture.files.map(file => {
          file.realName = file.name.replace(
            /[`~!@#$%^&*()_|+=?;:'",<>{}[\]\\/]/gi,
            ""
          );
          file.realName = file.realName.split(" ").join("");
          return file;
        });
        return lec;
      });
      return lecList;
    },
    cleanThumbnail(thumbnail) {
      console.log(thumbnail);
      thumbnail.realName = thumbnail.name;
      thumbnail.realName = thumbnail.realName.replace(
        /[`~!@#$%^&*()_|+=?;:'",<>{}[\]\\/]/gi,
        ""
      );
      thumbnail.realName = thumbnail.realName.split(" ").join("");
      return thumbnail;
    },
    cleanName(name) {
      return name.replace(
        /[`~!@#$%^&*()_|+=?;:'",<>{}[\]\\/]/gi,
        ""
      ).split(" ").join("")
    }
  }
};
</script>