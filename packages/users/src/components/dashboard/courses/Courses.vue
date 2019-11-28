<template>
    <v-container class="user-courses mt-1 pl-1 pr-1">
      <p p class="font-weight-bold display-1 text-justify"> My Courses </p> 
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

  },
  components: {
      CourseComponent
  }
};
</script>

<style lang="scss">
.user-courses {
  position: relative;
  height: 88vh;
  overflow-y: auto;
}

.user-courses::-webkit-scrollbar {
  width: 9px;
}

.user-courses::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.user-courses::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.8);
}
</style>