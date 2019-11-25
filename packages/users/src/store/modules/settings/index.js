import {actions} from './settings.actions';
import {getters} from './settings.getters';
import {mutations} from './settings.mutations';

const state = {
    darkMode: false
}

const namespaced = true;

export default {
    namespaced,
    state,
    actions,
    getters,
    mutations
}