import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueGeolocation from 'vue-geolocation-api'
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.use(VueGeolocation)
Vue.use(VueCookies)
Vue.use(VueAxios)

const kakaoKey = 'fae1a098029cf35226952ad2c245221a'
window.Kakao.init(kakaoKey);

Vue.$cookies.config("1d")

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
