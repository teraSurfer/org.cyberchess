import {actions} from './actions';
import {getters} from './getters';
import {mutations} from './mutations';

const state = {
    loggedIn: false,
}

const namespaced = true;

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
}