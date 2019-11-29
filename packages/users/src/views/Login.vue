    <template>
      <v-container class="fill-height page-container" fluid>
          <v-row align="center" justify="center">
              <v-col cols="12" sm="8" md="4" lg="4">
              <amplify-authenticator :authConfig="authConfig"></amplify-authenticator>
              </v-col>
          </v-row>
      </v-container>
    </template>

    <script>
    // import SignIn from '@/components/login/SignIn.vue';
    export default {
      data: () => ({
        authConfig: {
          usernameAttributes: 'Email',
          signUpConfig: {
            header: 'Cyberchess Admin Login',
            hideAllDefaults: true,
            defaultCountryCode: '1',
            signUpFields: [
              {
                label: 'Email',
                key: 'email',
                required: true,
                displayOrder: 1,
                type: 'string',
                signUpWith: true
              },
              {
                label: 'Password',
                key: 'password',
                required: true,
                displayOrder: 2,
                type: 'password'
              },
              {
                label: 'PhoneNumber',
                key: 'phone_number',
                required: true,
                displayOrder: 3,
                type: 'string'
              },
            ]
          }
        }
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