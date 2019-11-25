export const mutations = {
    LOGGED_IN(state){
        state.loggedIn = true;
    },
    LOGGED_OUT(state) {
        state.loggedIn = false;
    }
}