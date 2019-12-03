<template>
    <v-bottom-navigation active.sync="bottomNav" v-model="bottomNav" grow color="primary">
        <v-btn to="/dashboard/home" value="home">
            <span>Home</span>
            <v-icon>fa-home</v-icon>
        </v-btn>
        <v-btn to="/dashboard/courses" value="Courses">
            <span>Courses</span>
            <v-icon>fa-book-open</v-icon>
        </v-btn>
        <v-btn to="/dashboard/live" value="Live">
            <span>Live</span>
            <v-icon>fa-globe</v-icon>
        </v-btn>
    </v-bottom-navigation>
</template>

<script>
export default {
    data () {
      return {
        bottomNav: 'home',
      }
    },
  }
</script>