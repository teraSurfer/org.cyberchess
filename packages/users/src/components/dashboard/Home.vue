<template>
  <v-container class="justify-center align-start mt-10">
    <v-row class="all-courses justify-center align-start">
      <v-card v-if="allCourses.length == 0" flat>
        <v-card-text>
          <!--<h3>Looks like you dont have any courses yet.</h3>-->
        </v-card-text>
      </v-card>
      <v-col
        md="3"
        class="justify-center"
        v-for="course of allCourses"
        :key="course.course_id"
      >
        <v-card hover @click.stop.prevent="toCourse(course.course_id)" class="mx-auto" max-width="270">
          <v-img
            :src="course.thumbnail.key"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200px"
          ></v-img>
          <v-card-text>
            <h4 class="mb-0">{{course.course_name}}</h4>
            <p class="mb-0">{{course.excerpt}}</p>
            <p class="mb-0">{{course.course_id}}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!--<button v-on:click="loadCoursesPrev()">Previous</button><br/>-->
    <!--<button v-on:click="loadCoursesNext()">Next</button>-->
    <v-layout>
     <v-btn  v-on:click="loadCoursesPrev()" :disabled="cur_page==1">
     <span right>Prev</span>
     <v-icon right>fa-chevron-left</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
     <v-btn  v-on:click="loadCoursesNext()" :disabled="lastkeys.course_id==''">
     <span right>Next</span>
     <v-icon right>fa-chevron-right</v-icon>
    </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    allCourses: [],
    userInfo: '',
    lastkeys:{course_id:''},
    last_evaluated_key_for_page: [{course_id: ''}],
    cur_page: 0,
    
    
  }),
  props: {
    flag: Boolean
  },
  watch: {
    flag(n) {
      console.log(n)
      this.loadCoursesNext()
    }
  },
  async created() {
    this.loadCoursesNext()
    console.log(this.allCourses)
  },
  methods: {
    async loadCoursesNext() {
      try {
        
        this.allCourses = [];
        this.userInfo =  await this.$Amplify.Auth.currentUserInfo();
        this.userInfo = this.userInfo.id
        //const cognitoId = await this.$Amplify.Auth.currentSession();
        let api = "CyberChessApi";
        let params = `/courses?limit=5&last_key=${this.lastkeys.course_id}`;
        const response = await this.$Amplify.API.get(api, params);
        console.log(response)
        this.cur_page += 1;
        //alert(JSON.stringify(response))
        this.last_evaluated_key_for_page.push(JSON.parse(JSON.stringify(this.lastkeys)));
        if (response.LastEvaluatedKey)
        {
          this.lastkeys.course_id = response.LastEvaluatedKey.course_id
          console.log(this.lastkeys.course_id)
        }
        else
        {
          this.lastkeys = {course_id: ''}
        }
        let re = response.Items;
        console.log(re)
          re = re.map(async val => {
            const thumbUrl = await this.$Amplify.Storage.get(val.thumbnail.key, {level:'protected',identityId :val.instructor_id})
            val.thumbnail.key = this.$CyberChess.getCloudUrl(thumbUrl);
            return val;
          })
        Promise.allSettled(re).then(res => res.forEach(element => {
          if(element.status === 'fulfilled') this.allCourses.push(element.value);
        }))
      } catch(err) {
          console.log(err)
          // alert(err)
      }
    },

    async loadCoursesPrev() {
      try {
        let last_key = this.last_evaluated_key_for_page[this.cur_page - 1];
        this.cur_page -= 1;
        this.allCourses = [];
        this.userInfo =  await this.$Amplify.Auth.currentUserInfo();
        this.userInfo = this.userInfo.id
        //const cognitoId = await this.$Amplify.Auth.currentSession();
        let api = "CyberChessApi";
        let params = `/courses?limit=5&last_key=${last_key.course_id}`;
        const response = await this.$Amplify.API.get(api, params);
        console.log(response)
        //alert(JSON.stringify(response))
        this.lastkeys.course_id = response.LastEvaluatedKey.course_id
        console.log(this.lastkeys.course_id)
        let re = response.Items;
        console.log(re)
          re = re.map(async val => {
            const thumbUrl = await this.$Amplify.Storage.get(val.thumbnail.key, {level:'protected',identityId :val.instructor_id})
            val.thumbnail.key = this.$CyberChess.getCloudUrl(thumbUrl);
            return val;
          })
        Promise.allSettled(re).then(res => res.forEach(element => {
          if(element.status === 'fulfilled') this.allCourses.push(element.value);
        }))
      } catch(err) {
          console.log(err)
      }
    },
    toCourse(course) {
     if(course)
      this.$router.push(`/dashboard/HomeDetails/${course}`)
    },
    
  }
};
</script>

<style lang="scss" scoped>
.all-courses {
  height: 70vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.fixedheight {
  max-height: 4em;
}
</style>