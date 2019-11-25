import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@fortawesome/fontawesome-free/css/all.css';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: {
          customProperties: true,
        },
      themes: {
        light: {
          primary: '#732222',
          secondary: '#424242',
          accent: '#DADABE',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107'
        },
        dark: {
          primary: '#DADABE',
          secondary: '#424242',
          accent: '#732222',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107'
        }
      },
    },
    icons: {
      iconfont: 'fa',
    },
});
