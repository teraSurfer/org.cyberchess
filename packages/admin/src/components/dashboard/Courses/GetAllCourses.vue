<template>
  <v-container class="justify-center align-start">
    <v-row class="all-courses justify-center align-start">
      <v-card v-if="allCourses.length == 0" flat>
        <v-card-text>
          <h3>Looks like you dont have any courses yet.</h3>
        </v-card-text>
      </v-card>
      <v-col
        md="3"
        class="justify-center"
        v-for="course of allCourses"
        :key="course.course_id"
      >
        <v-card hover @click.stop.prevent="toCourse(course.course_id)" max-width="300">
          <v-img
            :src="course.thumbnail.key"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200px"
          ></v-img>
          <v-card-text>
            <h4 class="mb-0">{{course.name}}</h4>
            <p class="mb-0">{{course.excerpt}}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    allCourses: [],
    userInfo: '',
    baseUrl: ''
  }),
  props: {
    flag: Boolean
  },
  watch: {
    flag(n) {
      console.log(n)
      this.loadCourses()
    }
  },
  async created() {
    this.loadBaseUrl()
    this.loadCourses()
  },
  methods: {
    async loadCourses() {
      console.log('here?')
      try {
        this.allCourses = [];
        this.userInfo =  await this.$Amplify.Auth.currentUserInfo();
        this.userInfo = this.userInfo.id
        const cognitoId = await this.$Amplify.Auth.currentSession();
        const response = await this.$Amplify.API.get(
          "CyberChessApi",
          `/courses/instructor/${cognitoId.idToken.payload.sub}`
        );
        console.log(response)
        let re = response.Items;
          re = re.map(async val => {
            const thumbUrl = await this.$Amplify.Storage.get(val.thumbnail.key, {level: (val.is_listed) ? 'protected' : 'private'})
            val.thumbnail.key = thumbUrl.split('https://'+this.$Amplify.Storage._config.AWSS3.bucket+'.s3.amazonaws.com').join(this.baseUrl)
            console.log(val)
            return val;
          })
        Promise.allSettled(re).then(res => res.forEach(element => {
          if(element.status === 'fulfilled') this.allCourses.push(element.value);
        }))
        console.log(this.allCourses)
      } catch(err) {
          console.log(err)
      }
    },
    loadBaseUrl() {
      const urls = {
        dev: 'https://d15qyykdkts3kc.cloudfront.net',
        achalaesh: 'https://dd0fq9p45tg50.cloudfront.net'
      }
      let bucketName = this.$Amplify.Storage._config.AWSS3.bucket;
      let env = bucketName.split('-');
      this.baseUrl = urls[env[env.length-1]]
    },
    toCourse(course) {
      if(course)
      this.$router.push(`/dashboard/courses/${course}`)
    }
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