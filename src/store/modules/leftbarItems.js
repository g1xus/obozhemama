export default {
    state: {
        leftbarItems: [],
        myLeftbarItems: [],
        topLeftbarItems: []
    },
    mutations: {
        SET_BETS_TO_STATE: (state, bets) => {
            state.leftbarItems = bets
        },
        SET_MYBETS_TO_STATE: (state, bets) => {
            state.myLeftbarItems = bets
        },
        SET_TOPBETS_TO_STATE: (state, bets) => {
            state.topLeftbarItems = bets
        },
        RESET_BETS_TO_STATE: (state) => {
            state.leftbarItems = []
        }
    },
    actions: {
        RESET_BETS({commit}) {
            commit('RESET_BETS_TO_STATE')
        },
        GET_BETS_FROM_API({commit}, gameId) {
            return fetch(`http://185.173.39.122:5000/api/auth/getNowBets?gameId=${gameId}`, {
                method: 'GET'
            })
                .then((bets) => {
                    return bets.json()
                })
                .then((data) => {
                    commit('SET_BETS_TO_STATE', data)
                })
                .catch((e) => {
                    console.log(e)
                    return e
                })
        },
        GET_PREVBETS_FROM_API({commit}) {
            return fetch(`http://185.173.39.122:5000/api/auth/getPrevBets`, {
                method: 'GET'
            })
                .then((bets) => {
                    return bets.json()
                })
                .then((data) => {
                    commit('SET_BETS_TO_STATE', data)
                })
                .catch((e) => {
                    console.log(e)
                    return e
                })
        },
        GET_MYBETS_FROM_API({commit}) {
            const jwt = document.cookie.split('=')
            return fetch(`http://185.173.39.122:5000/api/auth/getMyBets`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${jwt[1]}`
                }
            })
                .then((bets) => {
                    return bets.json()
                })
                .then((data) => {
                    commit('SET_MYBETS_TO_STATE', data)
                })
                .catch((e) => {
                    console.log(e)
                    return e
                })
        },
        GET_TOPBETS_FROM_API({commit}) {
            return fetch(`http://185.173.39.122:5000/api/auth/getTopBets`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            })
                .then((bets) => {
                    return bets.json()
                })
                .then((data) => {
                    commit('SET_TOPBETS_TO_STATE', data)
                })
                .catch((e) => {
                    console.log(e)
                    return e
                })
        },

    },
    getters: {
        validLeftbarItems(state) {
            return state.leftbarItems
        },
        myLeftbarItems(state) {
            return state.myLeftbarItems
        },
        topLeftbarItems(state) {
            return state.topLeftbarItems
        },
        leftbarItemsCount(state, getters) {
            return getters.validLeftbarItems.length;
        }
    }
}