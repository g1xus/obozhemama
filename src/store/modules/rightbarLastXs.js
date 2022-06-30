export default {
    state: {
        rightbarLastXs: []
    },
    mutations: {
        SET_LASTXS_TO_STATE: (state, rightbarLastXs) => {
            state.rightbarLastXs = rightbarLastXs
        }
    },
    actions: {
        GET_LASTXS_FROM_API({commit}) {
            return fetch(`http://109.107.187.195:5000/api/auth/lastXs`, {
                method: 'GET'
            })
                .then((rightbarLastXs) =>{
                    return rightbarLastXs.json()
                })
                .then((data) =>{
                    commit('SET_LASTXS_TO_STATE', data)
                })
                .catch((e) => {
                    console.log(e)
                    return e
                })
        }
    },
    getters: {
        validLastXs(state) {
            return state.rightbarLastXs
        }
    }
}