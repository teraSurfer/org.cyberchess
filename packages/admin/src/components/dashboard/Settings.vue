<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
            <v-icon>
                fa-cog
            </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar>
          <v-btn icon @click="dialog = false">
            <v-icon>fa-times</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>General Appearance</v-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-switch color="info" @change="changeTheme" v-model="darkMode"></v-switch>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Dark Mode</v-list-item-title>
              <v-list-item-subtitle>Toggle between dark and light modes.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
        darkMode: false
      }
    },
    mounted() {
        this.darkMode = this.$store.getters['settings/darkMode'];
    },
    methods: {
        changeTheme() {
            this.$vuetify.theme.dark = this.darkMode
            this.$store.dispatch('settings/SET_DARK_MODE', this.darkMode)
        }
    }
  }
</script>