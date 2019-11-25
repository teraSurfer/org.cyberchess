<template>
  <v-form @submit.stop.prevent="handleLecturesSubmit" class="text-center mb-2" v-model="valid">
    <v-row class="fill-width">
      <v-col cols="12">
        <h4 v-if="l.length == 0">You don't have any lectures yet.</h4>
        <v-card flat v-for="(lecture, index) in l" class="mt-2" :key="index">
          <v-card-text class="pb-0">
            <v-row class="pr-2 pl-2">
              <span>Lecture #{{index}}</span>
              <v-spacer />
              <v-btn @click="removeLecture(index)" icon>
                <v-icon color="error">fa-times</v-icon>
              </v-btn>
            </v-row>
          </v-card-text>
          <v-card-text class="pt-0">
            <v-text-field
              label="Lecture name"
              :rules="rules.lectureNameRules"
              v-model="lecture.name"
            ></v-text-field>
            <v-textarea
              outlined
              label="Lecture description"
              v-model="lecture.description"
              :rules="rules.lectureDescriptionRules"
            ></v-textarea>
            <v-file-input
              chips
              show-size
              counter
              multiple
              accept=".mp4, .mkv, .pdf, .pgn"
              v-model="lecture.files"
              label="Lecture Material"
              :rules="rules.lectureFileRules"
            ></v-file-input>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-btn @click="addLecture">
        <v-icon left>fa-plus</v-icon>
        <span right>Add lecture</span>
      </v-btn>
    </v-row>
    <v-row class="fill-width justify-center mt-4">
      <v-btn outlined class="mr-2" @click="goBack">
        <v-icon left>fa-chevron-left</v-icon>
        <span right>Back</span>
      </v-btn>
      <v-btn :disabled="!valid" outlined type="submit">
        <span left>Next</span>
        <v-icon right>fa-chevron-right</v-icon>
      </v-btn>
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: {
    l: Array
  },
  data: () => ({
    valid: false,
    rules: {
      lectureNameRules: [
        v => !!v || "Lecture name is required",
      ],
      lectureDescriptionRules: [
        v => !!v || "Lecture description is required",
      ],
      lectureFileRules: [
        v => !!v || "Atleast one file is required",
        v => {
          if(v.length > 0) {
            let pdfCount = 0
            let videoCount = 0
            let pgnCount = 0
            v.forEach(file => {
              switch(file.type) {
                case 'application/pdf':
                  ++pdfCount;
                  break;
                case 'video/mp4':
                  ++videoCount;
                  break;
                case 'video/x-matroska':
                  ++videoCount;
                  break;
                case 'application/vnd.chess-pgn':
                  ++pgnCount;
                  break;
                default:
                  return 'Invalid file type'
              }
            })
            let flag = (pdfCount > 10) ? 'PDF' : 
                    (videoCount > 1) ? 'video' : (pgnCount > 10) ? 'PGN' : ''
            return (pdfCount <=10 && videoCount < 2 && pgnCount <= 10) ? true : 
            `You have too many ${flag} files.`
          }
          else return 'Atleast one file is required'
        }
      ]
    }
  }),
  methods: {
    addLecture() {
      this.l.push({});
    },
    removeLecture(index) {
      console.log(index);
      this.l.splice(index, 1);
    },
    handleLecturesSubmit() {
      if (this.valid) {
        this.$emit("form-submitted", this.l);
      }
    },
    goBack() {
      this.$emit("cyb-back");
    }
  }
};
</script>