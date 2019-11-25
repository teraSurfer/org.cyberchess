<template>
  <v-container class="justify-center">
    <v-row class="all-courses justify-center">
      <v-card class="fixedheight" v-if="allCourses.length == 0" flat>
        <v-card-text class>
          <h3>Looks like you dont have any courses yet.</h3>
        </v-card-text>
      </v-card>
      <v-col
        md="4"
        class="justify-center"
        v-for="course of allCourses"
        :key="course.courseId"
      >
        <v-card max-width="300">
          <v-img
            :src="course.thumbnail.key"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200px"
          ></v-img>
          <v-card-text>{{course.name}}</v-card-text>
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
    baseUrl: 'https://d374vdvxs4yy73.cloudfront.net'
  }),
  props: {
    flag: Boolean
  },
  watch: {
    flag(n) {
      if(this.flag != n) this.loadCourses()
    }
  },
  async created() {
    this.loadBaseUrl()
    this.loadCourses()
  },
  methods: {
    async loadCourses() {
      try {
        this.allCourses = [];
        this.userInfo =  await this.$Amplify.Auth.currentUserInfo();
        this.userInfo = this.userInfo.id
        const cognitoId = await this.$Amplify.Auth.currentSession();
        const response = await this.$Amplify.API.get(
          "CyberChessApi",
          `/courses/instructor/${cognitoId.idToken.payload.sub}`
        );
        let re = response.Items;
          re = re.map(async val => {
            const thumbUrl = await this.$Amplify.Storage.get(val.thumbnail.key, {level: (val.isListed) ? 'protected' : 'private'})
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
        dev: 'https://d15qyykdkts3kc.cloudfront.net'
      }
      let bucketName = this.$Amplify.Storage._config.AWSS3.bucket;
      let env = bucketName.split('-');
      this.baseUrl = urls[env[env.length-1]]
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
.fixedheight {
  max-height: 3.5em;
}
</style>