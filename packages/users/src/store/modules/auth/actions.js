export const AUTH_ACTIONS = {
    LOGGED_IN: 'LOGGED_IN',
    LOGGED_OUT: 'LOGGED_OUT',
}

export const actions = {
    LOGGED_IN({commit}) {
        commit(AUTH_ACTIONS.LOGGED_IN);
    },
    LOGGED_OUT({commit}) {
        commit(AUTH_ACTIONS.LOGGED_OUT)
    },
}