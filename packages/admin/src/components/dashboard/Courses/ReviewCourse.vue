<template>
  <v-form @submit.stop.prevent="confirmCourse">
    <v-card v-if="c" flat>
      <v-card-title class="justify-center">Review Course Details</v-card-title>
      <v-card-text>
        <v-list two-line>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Course name:</v-list-item-title>
              <v-list-item-subtitle>{{c.course_name}}</v-list-item-subtitle>
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
                  <v-chip v-if="!file.realName">{{file.name}}</v-chip>
                  <v-chip v-if="file.realName">{{file.realName}}</v-chip>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
          </v-card>
          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="c.is_listed" color="info" />
            </v-list-item-action>
            <v-list-item-content>Would you like to list this course now?</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-file-input
              v-model="c.thumbnail"
              :rules="fileRules"
              v-if="thumb"
              show-size
              accept=".jpg, .png, .svg"
            ></v-file-input>
              <v-list-item-subtitle>Select a thumbnail for this course</v-list-item-subtitle>
              <v-chip @click:close="delThumb" v-if="!thumb " close>{{c.thumbnail.key.split("/")[1]}}</v-chip>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn :loading="isSubmitted" :disabled="isSubmitted" outlined class="mr-2" @click="goBack">
          <v-icon left>fa-chevron-left</v-icon>
          <span right>Back</span>
        </v-btn>
        <v-btn :loading="isSubmitted" :disabled="isSubmitted" type="submit">
          <span v-if="type==='create'" left>Create course</span>
          <span v-if="type==='update'" left>Update course</span>
          <v-icon right>fa-chevron-right</v-icon>
        </v-btn>
        <v-dialog v-model="isSubmitted" persistent width="300">
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
    c: Object,
    type: {
      type: String,
      default: 'create'
    }
  },
  created() {
    console.log(this.c);
    if(this.type === 'create') this.thumb = true 
  },
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
    thumb: false,
    lecturesFlag: false
  }),
  methods: {
    goBack() {
      this.$emit("cyb-back");
    },
    async confirmCourse() {
      try {
        this.isSubmitted = true;
        let course = {};
        course.thumbnail = (this.c.thumbnail.key) ? this.c.thumbnail : this.cleanThumbnail(this.c.thumbnail);
        course.lectures = this.cleanLectures(this.c.lectures.lectureList);
        course.course_name = this.c.course_name;
        course.instructor = await this.$Amplify.Auth.currentSession();
        course.instructor = course.instructor.idToken.payload.sub;
        course.is_listed = this.c.is_listed;
        course.excerpt = this.c.excerpt;
        console.log(course)
        let self = this;
        if(!course.thumbnail.key) {
        course.thumbnail = await this.$Amplify.Storage.put(
          `${this.cleanName(course.course_name)}/${course.thumbnail.realName}`,
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
        }
          for (let lecture of course.lectures) {
            for (let file of lecture.files) {
              console.log(course.course_name, lecture.name, file)
              if(!file.key) {
              let f = await this.$Amplify.Storage.put(
                `${this.cleanName(course.course_name)}/${this.cleanName(lecture.name)}/${file.realName}`,
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
              file.key = f.key;
            }
            }
          }
          console.log(course);
          if(this.type === 'create') {
            await this.$Amplify.API.post("CyberChessApi", "/courses", {
              body: { ...course }
            });
            this.isSubmitted = false;
            this.$emit("course-created");
            this.course = {}
          } else if (this.type === 'update') {
            await this.$Amplify.API.patch("CyberChessApi", `/courses/object/${this.c.course_id}`, {
              body: {...course}
            });
            this.isSubmitted = false;
            this.$emit("course-updated");
            this.course = {}
          }
      } catch (err) {
        console.log(err);
        swal(
          "Sorry!",
          "There was an error. Please try again.",
          "error"
        );
        this.isSubmitted = false;
      }
    },
    cleanLectures(lectureList) {
      let lecList = lectureList.map(lecture => {
        let lec = { ...lecture };
        lec.files = lecture.files.map(file => {
          if(!file.key) {
            file.realName = file.name.replace(
              /[`~!@#$%^&*()_|+=?;:'",<>{}[\]\\/]/gi,
              ""
            );
            file.realName = file.realName.split(" ").join("");
            return file;
          } return file;
        });
        return lec;
      });
      return lecList;
    },
    cleanThumbnail(thumbnail) {
      thumbnail.realName = thumbnail.name;
      thumbnail.realName = thumbnail.realName.replace(
        /[`~!@#$%^&*()_|+=?;:'",<>{}[\]\\/]/gi,
        ""
      );
      thumbnail.realName = thumbnail.realName.split(" ").join("");
      console.log(thumbnail);
      return thumbnail;
    },
    cleanName(name) {
      console.log(name)
      return name.replace(
        /[`~!@#$%^&*()_|+=?;:'",<>{}[\]\\/]/gi,
        ""
      ).split(" ").join("")
    },
    delThumb(){
      this.thumb = true
      this.c.thumbnail = null
    }
  }
};
</script>