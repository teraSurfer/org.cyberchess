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
    this.$vuetify.theme.dark = true;
  },

  computed: {
    isLogin() {
      return (this.$route.name === 'login') ? true : false
    }
  },
  
  async mounted() {
    let self = this;
    AmplifyEventBus.$on('authState', async function(authState) {
      if(authState === 'signedIn') {
        const currentSession = await self.$Amplify.Auth.currentSession();
        if(currentSession) {
          self.$store.dispatch('auth/LOGGED_IN');
          self.$router.push('dashboard');
        } else {
          swal('Error','Something went wrong. Please login again', 'error')
          window.localStorage.clear();
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
    scrollbar-width: 9x;
    scrollbar-color: rgba(0, 0, 0, 0.1);
    scrollbar-track-color: rgba(0, 0, 0, 0.8);
  }

  body {
    font-family: 'Open Sans', 'Roboto', sans-serif;
  }

  ::-webkit-scrollbar{
   width: 9px; 
  }
  ::-webkit-scrollbar-track{
   -webkit-box-shadow: insert 0 0 5x rgba(0, 0, 0, 0.1);
   border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb{
   -webkit-box-shadow: insert 0 0 6px rgba(0, 0, 0, 0.8);
   border-radius: 10px; 
  }

</style>