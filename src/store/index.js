import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userData: {}
  },
  mutations: {
    addState(state, palyload) {
      state.userData = palyload
    }
  },
  actions: {
  },
  modules: {
  }
})

export default store
