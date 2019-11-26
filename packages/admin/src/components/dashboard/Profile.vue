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
              <v-list-item-title>{{email}}</v-list-item-title>
              <!--<v-list-item-subtitle>Your email address</v-list-item-subtitle>-->
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <!--<v-divider></v-divider>-->
        <v-list three-line subheader>
          <v-list-item>
          <v-subheader>Phone Number: </v-subheader>
            <v-list-item-content>
              <v-list-item-title>{{phone_number}}</v-list-item-title>
              <!--<v-list-item-subtitle>Your phone number</v-list-item-subtitle>-->
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <!--<v-divider></v-divider>-->
        <v-list three-line subheader>
          <v-list-item>
          <v-subheader>UserID: </v-subheader>
            <v-list-item-content>
              <v-list-item-title>{{user_id}}</v-list-item-title>
              <!--<v-list-item-subtitle>Your ID number</v-list-item-subtitle> -->
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
import { API } from 'aws-amplify'
  export default {
    data () {
      return {
        dialog: false,
        darkMode: false,
        email : '',
        apiName : 'CyberChessApi',
        id : '',
        phone_number :'',
        user_id : '',

      }
    },
    async mounted() {
        this.darkMode = this.$store.getters['settings/darkMode']
        const user = await this.$Amplify.Auth.currentSession()
        console.log(user)
        //this.id = user.idToken.payload.sub;
        //const user_id = this.id;
        //console.log(this.id)
    },
    methods: {
        changeTheme() {
            this.$vuetify.theme.dark = this.darkMode
            this.$store.dispatch('settings/SET_DARK_MODE', this.darkMode)
        },
        updateEmail: async function () {
             //console.log(this.id)
              //this.id = user.idToken.payload.sub;
             //const credentials = await this.$amplify.Auth.currentCredentials();
             const user = await this.$Amplify.Auth.currentSession()
             console.log(user)
             this.id = user.idToken.payload.sub;
             console.log(this.id)
             //const user_id = this.id;
             const apiPath = `/profiles/${this.id}`
             const response = await API.get(this.apiName,apiPath)
             console.log(response)
              this.email = response[0].email_id
              this.phone_number = response[0].phone_number;
              this.user_id = response[0].user_id;
              console.log(this.email)
              console.log(this.phone_number)
              console.log(this.user_id)

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
    },
    created () {
      this.updateEmail()
      //setInterval(this.updateEmail, 3000)
    }
  }
</script>