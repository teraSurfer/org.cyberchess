import {actions} from './actions';
import {getters} from './getters';
import {mutations} from './mutations';

const state = {
    loggedIn: false,
    twilio_token: ''
}

const namespaced = true;

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
}