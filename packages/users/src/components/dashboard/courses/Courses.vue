<template>
    <v-container class="user-courses mt-8">
      <v-row dense>      
        <v-col  v-for="course in courses" :key="course.id" cols-sm="12" cols-md="6" cols-lg="3" >
              <course-component  :course="course"  /> 
        </v-col>
      </v-row>
   </v-container>
</template>


<script>
import CourseComponent from './CourseComponent.vue'
export default {
  data: () => ({
    courses: [
      {
        id: "1",
        courseName: "aaaaaaa",
        courseInstructor: "Roger Navarro",
        courseThumbnail: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
        courseDetails:
          "I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.",
        suscribe: true
      },
      {
        id: "3",
        courseName: "ddddddd",
        courseInstructor: "Jyothi HR",
        courseThumbnail: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
        courseDetails:
          "I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.",
        suscribe: true
      },
      {
        id: "5",
        courseName: "yyyyyyy",
        courseInstructor: "Sergio Aguilar",
        courseThumbnail: "https://cdn.vuetifyjs.com/images/cards/cooking.png",
        courseDetails:
          "I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.",
        suscribe: true
      },
      {
        id: "10",
        courseName: "bbbbbbb",
        courseInstructor: "Sergio Aguilar",
        courseThumbnail: "https://cdn.vuetifyjs.com/images/cards/store.jpg",
        courseDetails:
          "I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.",
        suscribe: true
      },

      {
        id: "12",
        courseName: "ddddddd",
        courseInstructor: "Jyothi HR",
        courseThumbnail: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
        courseDetails:
          "I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.",
        suscribe: true
      },
      {
        id: "14",
        courseName: "yyyyyyy",
        courseInstructor: "Sergio Aguilar",
        courseThumbnail: "https://cdn.vuetifyjs.com/images/cards/cooking.png",
        courseDetails:
          "I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.",
        suscribe: true
      },

      {
        id: "17",
        courseName: "aaaaaaa",
        courseInstructor: "Roger Navarro",
        courseThumbnail: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
        courseDetails:
          "I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.",
        suscribe: true
      },
      {
        id: "18",
        courseName: "bbbbbbb",
        courseInstructor: "Sergio Aguilar",
        courseThumbnail: "https://cdn.vuetifyjs.com/images/cards/store.jpg",
        courseDetails:
          "I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.",
        suscribe: true
      },

      {
        id: "20",
        courseName: "ddddddd",
        courseInstructor: "Jyothi HR",
        courseThumbnail: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
        courseDetails:
          "I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.",
        suscribe: true
      },

      {
        id: "22",
        courseName: "yyyyyyy",
        courseInstructor: "Sergio Aguilar",
        courseThumbnail: "https://cdn.vuetifyjs.com/images/cards/cooking.png",
        courseDetails:
          "I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.",
        suscribe: true
      },
     {
        id: "23",
        courseName: "ccccccc",
        courseInstructor: "Achalaesh Lanka",
        courseThumbnail: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
        courseDetails:
          "I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.",
        suscribe: true
      },
      {
        id: "25",
        courseName: "iiiiiii",
        courseInstructor: "Jyothi HR",
        courseThumbnail: "https://cdn.vuetifyjs.com/images/cards/store.jpg",
        courseDetails:
          "I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.",
        suscribe: true
      },

    ]
  }),
  methods: {
        async getCourse() {
          this.loading = true;
          try {
                let myProfileID= "3a5da7b2-578a-461b-a3f5-21e671590e8b";
                let dynamoKey= `/subscriptions/profile_id/${myProfileID}`; 
                console.log("dynamoKey: " + dynamoKey);
        
                const cognitoId = await this.$Amplify.Auth.currentSession();
                console.log("cognito ", cognitoId.idToken.payload['cognito:username']);
                console.log("cognito ", cognitoId.idToken.payload.sub);

                let response= await this.$Amplify.API.get(
                  "CyberChessApi", 
                  `/subscriptions/profile_id/${myProfileID}`
                ); 
                console.log(response); 

          }catch (err) {
            console.log(err);
          }
        },

  },
  components: {
      CourseComponent
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
