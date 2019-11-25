import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import settingsModule from './modules/settings';
import authModule from './modules/auth';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

export default new Vuex.Store({
  plugins: [vuexLocal.plugin],
  modules: {
    settings: settingsModule,
    auth: authModule
  }
});