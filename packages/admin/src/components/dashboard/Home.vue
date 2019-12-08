<template>
  <v-container>
    <v-card class="fill-height mt-8">
      <v-toolbar>
        <v-toolbar-title>Cyber Chess Admin Dashboard</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="createRoom">
          Create / Join
          <v-icon right>fa-plus</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="text-center justify-center">
        <v-img width="100" class="mx-auto" src="../../assets/logo.svg"></v-img>
        <h3 class="mt-2">Welcome Coach!</h3>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import swal from "sweetalert";
export default {
  methods: {
    async createRoom() {
      let name = await swal({
        title: "Enter room name",
        content: "input"
      });
      this.$router.push(
        `/dashboard/live?room=${encodeURIComponent(name)}&create=true`
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.yy {
  width: 100%;
}
</style>