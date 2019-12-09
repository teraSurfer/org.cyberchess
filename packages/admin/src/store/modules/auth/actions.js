export const AUTH_ACTIONS = {
    LOGGED_IN: 'LOGGED_IN',
    LOGGED_OUT: 'LOGGED_OUT',
    TWILIO_TOKEN: 'TWILIO_TOKEN'
}

export const actions = {
    LOGGED_IN({commit}) {
        commit(AUTH_ACTIONS.LOGGED_IN);
    },
    LOGGED_OUT({commit}) {
        commit(AUTH_ACTIONS.LOGGED_OUT)
    },
    TWILIO_TOKEN({commit}, payload) {
        commit(AUTH_ACTIONS.TWILIO_TOKEN, payload)
    }
}