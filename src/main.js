import { createApp} from "vue";
import Vuex from "vuex";
import App from './App'
import router from '@/router'

import store from "./store";

const app = createApp(App)

app.use(Vuex)
app.use(router)
app.use(store)
app.mount('#app')
