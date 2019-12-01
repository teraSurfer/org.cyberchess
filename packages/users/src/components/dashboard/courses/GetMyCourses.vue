<template>
    <v-container class="user-courses mt-8">
      <v-row dense>  
        <v-card v-if="myCourses.length == 0" flat>
          <v-card-text>
              <h3>Looks like you dont have any courses yet.</h3>
          </v-card-text>
        </v-card>
        <v-col  v-for="course in myCourses" :key="course.id" cols-sm="12" cols-md="6" cols-lg="3" >
              <course-preview  :course="course"  /> 
        </v-col>
      </v-row>
   </v-container>
</template>


<script>
import CoursePreview from './CoursePreview.vue'
export default {
  data: () => ({
    myCourses: [],
    userId: '',
   
  }),
  async created() {
    this.getMyCourses()
  },
  methods: {
        async getMyCourses() {
          try {
                this.myCourses = [];
                const cognitoId = await this.$Amplify.Auth.currentSession();
                //console.log("cognito ", cognitoId.idToken.payload['cognito:username']);
                this.userId = cognitoId.idToken.payload['cognito:username']
                let dynamoKey= `/subscriptions/profile_id/${this.userId}`; 
                console.log("dynamoKey: " + dynamoKey);
        
                let response= await this.$Amplify.API.get(
                  "CyberChessApi", 
                   dynamoKey
                ); 
              
                let re = response.courses;

                re = re.map(async val => {
                  const thumbUrl = await this.$Amplify.Storage.get(val.thumbnail.key, {level:'protected',identityId :val.instructor_id})
                  val.thumbnail.key = this.$CyberChess.getCloudUrl(thumbUrl);
                  return val;
                })

                Promise.allSettled(re).then(res => res.forEach(element => {
                  if(element.status === 'fulfilled') this.myCourses.push(element.value);
                })) 
                console.log(this.myCourses);
                console.log("---ACHA--->")
                console.log(this.$Amplify.Storage);

          }catch (err) {
              console.log(err);
          }
        },
        toCourse(course) {
           if(course)
              this.$router.push(`/dashboard/courses/${course}`)
        }

  },
  components: {
      CoursePreview
  }
};
</script>


<style lang="scss" scoped>
.user-courses {
  height: 65vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.fill-width {
  width: 100%;
}
</style>
