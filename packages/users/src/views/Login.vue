<template>
  <v-container class="fill-height page-container" fluid>
      <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4" lg="4">
           <amplify-authenticator></amplify-authenticator>
          </v-col>
      </v-row>
  </v-container>
</template>

<script>
// import SignIn from '@/components/login/SignIn.vue';
export default {
  data: () => ({
    signIn: true
  }),
  components: {
    // SignIn
  }
}
</script>

<style lang="scss">
    .page-container {
        background: url('../assets/Untitled.svg') no-repeat;
        background-size: cover;
    }
    @media only screen and (max-width: 599px) {
      .Form__formSection___3tqxz {
        min-width: auto;
      }
    }
    .Button__button___1FrBC {
      background-color: #732222;
    }
    .Button__button___1FrBC:focus{
      background-color: #732222;
    }
</style>