import Vue from 'vue'
import Vuex from 'vuex'
import userStore from '@/store/modules/userStore';
import createPersistedState from 'vuex-persistedstate';


Vue.use(Vuex)

export default new Vuex.Store({

  modules: {
    userStore: userStore
  },
  plugins:[createPersistedState({
      path:['userStore']
  })],
})
