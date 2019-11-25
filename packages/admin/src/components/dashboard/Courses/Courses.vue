<template>
    <v-col>
        <add-new-course v-on:course-created="courseCreated()" />
        <v-row>
            <get-all-courses :flag="flag" />
        </v-row>
    </v-col>
</template>

<script>
import AddNewCourse from './AddNewCourse.vue'
import GetAllCourses from './GetAllCourses.vue'
import swal from 'sweetalert'
export default {
    data: () => ({
        flag: false
    }),
    components: {
        AddNewCourse,
        GetAllCourses
    },
    methods: {
        courseCreated() {
            swal('Success', 'Your course has been created successfully.', 'success')
            this.flag = true
        }
    }
}
</script>