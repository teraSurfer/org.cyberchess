<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
            <v-icon>
                fa-user
            </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar>
          <v-btn icon @click="dialog = false">
            <v-icon>fa-times</v-icon>
          </v-btn>
          <v-toolbar-title>Profile</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list three-line subheader>
          <v-list-item>
          <v-subheader>Email: </v-subheader>
            <v-list-item-content>
              <v-list-item-title>{{}}</v-list-item-title>
              <v-list-item-subtitle>Your email address</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Sign Out
              </v-list-item-title>
              <v-list-item-action>
                <v-btn @click="logout" elevation="0" small color="error">
                   Sign Out
                   <v-icon right>fa-sign-out-alt</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {AmplifyEventBus} from 'aws-amplify-vue';
  export default {
    data () {
      return {
        dialog: false,
        darkMode: false,

      }
    },
    async mounted() {
        this.darkMode = this.$store.getters['settings/darkMode']
        const user = await this.$Amplify.Auth.currentSession()
        console.log(user)
    },
    methods: {
        changeTheme() {
            this.$vuetify.theme.dark = this.darkMode
            this.$store.dispatch('settings/SET_DARK_MODE', this.darkMode)
        },
        logout() {
          this.$Amplify.Auth.signOut()
            .then(() => {
              console.info('signout success');
              AmplifyEventBus.$emit('authState', 'signedOut');
              this.$store.dispatch('auth/LOGGED_OUT');
              return this.$router.push('/');
            })
            .catch(e => console.log(e));
        }
    }
  }
</script>