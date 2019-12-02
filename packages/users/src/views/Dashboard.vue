<template>
  <v-container fluid class="fill-height padding-0">
    <sidebar :sidebar="expand" v-on:check="setExpand($event)" />
    <v-col class="pt-0 dashboard padding-0">
      <v-toolbar flat class="pl-2 fixed-top">
        <v-btn @click="expand =!expand" icon text>
          <v-icon>fa-bars</v-icon>
        </v-btn>
        <v-spacer />
        <h4 class="mb-0">User Dashboard - {{getTitle}}</h4>
        <v-spacer />
      </v-toolbar>
      <router-view />
    </v-col>
    <bottom-nav class="fixed-bottom" />
  </v-container>
</template>


<script>
import Sidebar from "@/components/dashboard/Sidebar.vue";
import BottomNav from "@/components/dashboard/BottomNav.vue";
export default {
  components: {
    Sidebar,
    BottomNav
  },
  created() {
    if (this.$route.name === "Dashboard") this.$router.push("/dashboard/home");
  },
  computed: {
    getTitle() {
      return this.$route.name;
    }
  },
  data: () => ({
    expand: true
  }),
  methods: {
    setExpand(e) {
      this.expand = e;
    }
  }
};
</script>

<style lang="scss">
.dashboard {
  height: calc(100% - 56px);
}
.padding-0 {
  padding: 0;
}
.fixed-bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
.fixed-top {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
}
</style>