import axios from 'axios'


const userStore = {

  state: {
    userInfo: undefined,//thumbnail, id, nickname
    fishTmp: undefined,
    snackbarCookie: 0,
  },
  getters: {

  },
  mutations: {
    fishToState : function (state, payload) {
      state.fishTmp = payload
    },
    userToState : function (state, payload) {
      state.userInfo = payload
    },
    snackbarCookie : function(state) {
      state.snackbarCookie ++
    },
    snackbarCookieReset : function(state) {
      state.snackbarCookie = 0
    }
  },
  actions: {
    fishTmpAction: function ({commit}, payload) {
      commit('fishToState', payload)
    },

    snackbarCookie: function({commit}){
      commit('snackbarCookie')
    },

    snackbarCookieReset: function({commit}){
      commit('snackbarCookieReset')
    },

    userGetAction: async function ({commit}, {data, social}) {
      if( social === 'kakao'){
        await axios.post("https://nunukang.shop/kakao", data)
        .then( res => {
          console.log(res.data); //id: , nickname: , thumbnail:
          commit('userToState',res.data);
          console.log(this.state.userInfo);
        }).catch( err => {
          console.log(err)
        })

      } else {
        console.log('여기는 스토어 actions naver',data)
        await axios.post("https://nunukang.shop/naver", data)
        .then( res => {
          console.log('네이버axios응답값:',res.data); //id: , nickname: , thumbnail:
          commit('userToState',res.data);
          console.log('state.userInfo:',this.state.userInfo);
        }).catch( err => {
          console.log(err)
        })
      } 

    },

  },

  modules: {
  },
}

export default userStore