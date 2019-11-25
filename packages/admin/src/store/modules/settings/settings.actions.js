export const SETTINGS_ACTIONS = {
    SET_DARK_MODE: 'SET_DARK_MODE'
}

export const actions = {
    SET_DARK_MODE({commit}, payload) {
        commit(SETTINGS_ACTIONS.SET_DARK_MODE, payload);
    }
}
