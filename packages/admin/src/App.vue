<template>
  <v-app class="cyb-app">
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import {components, AmplifyEventBus} from 'aws-amplify-vue';
import swal from 'sweetalert';
export default {
  name: 'App',

  components: {
    ...components,
  },

  data: () => ({
    //
  }),
  created() {
    this.$vuetify.theme.dark = this.$store.getters['settings/darkMode'];
  },

  computed: {
    isLogin() {
      return (this.$route.name === 'login') ? true : false
    }
  },
  
  async mounted() {
    let self = this;
    console.log(await this.$Amplify.Auth.currentCredentials());
    AmplifyEventBus.$on('authState', async function(authState) {
      if(authState === 'signedIn') {
        const currentSession = await self.$Amplify.Auth.currentSession();
        console.log(currentSession.idToken.payload['cognito:groups']);
        if(currentSession.idToken.payload['cognito:groups'] && currentSession.idToken.payload['cognito:groups'][0] === 'Admin') { 
          self.$store.dispatch('auth/LOGGED_IN');
          self.$router.push('dashboard');
        } else {
          window.localStorage.clear();
          swal('Sorry', 'You are not authorized', 'error');
          window.location.href = '/';
        }
      }
    })
  }
};
</script>

<style lang="scss">
@import '@/scss/_variables.scss';
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap');
  #app {
    font-family: 'Open Sans', 'Roboto', sans-serif;
  }


  body, html{
    height: 100%;
    width: 100%;
    overflow-y: hidden !important;
    overflow-x: hidden;
    scrollbar-width: 9px;
    scrollbar-color: rgba(0,0,0,0.1);
    scrollbar-track-color: rgba(0, 0, 0, 0.8);
  }

  body {
    font-family: 'Open Sans', 'Roboto', sans-serif;
  }

::-webkit-scrollbar {
 width: 9px;
}
::-webkit-scrollbar-track {
 -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
 border-radius: 10px;
}
::-webkit-scrollbar-thumb {
 border-radius: 10px;
 -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.8);
}
  
</style>