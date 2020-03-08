import Vue from 'vue'
import Vuex from 'vuex'
import role from './modules/role'
import article from './modules/article'
import user from './modules/user'
import album from './modules/album'
import chart from './modules/chart'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    role,
    article,
    user,
    album,
    chart
    // login
  }
})  
