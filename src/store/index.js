import {createStore} from "vuex";
import leftbarItems from "@/store/modules/leftbarItems";
import profiles from "@/store/modules/profiles";
import rightbarLastXs from "@/store/modules/rightbarLastXs";

export const store = createStore({
    state: {
            headerLinks: [
                {id: 1, title: 'Главная'},
                {id: 2, title: 'Честная игра'},
                {id: 3, title: 'FAQ'},
                {id: 4, title: 'Поддержка'},
                {id: 5, title: 'Акции'}
            ],
            navGamesItems: [
                {id: 1, imgPath: require('@/assets/img/crash.svg'), title: 'Crash', url: '/'},
                {id: 1, imgPath: require('@/assets/img/dice.svg'), title: 'Dice', url: '/'}
            ],
            user: {
                balance: 0
            },
            socket: null
        },
    mutations: {},
    actions: {},
    getters: {},
    modules:{
        leftbarItems, profiles, rightbarLastXs
    }
    }
)

export default store