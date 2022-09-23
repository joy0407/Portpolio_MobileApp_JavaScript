<template>
  <v-app>
    <v-app-bar
      style="background:#FFFFFF; opacity: 90%;"
      light
      absolute
      dense
      app
      elevate-on-scroll
      scroll-target="#main"
    >
      <v-spacer></v-spacer>
      <div class="d-flex align-center pl-10">
  <v-img
          alt="nunukang"
          class="shrink mt-1"
          contain
          min-width="50"
          width="70"
          :src="require('./assets/nunukang.jpeg')"
          max-width="120"
        />
        <!-- <h2 class="headline font-weight-semibold pl-10" style="color:dimgrey;">
          nunukang
        </h2> -->
      </div>
      <v-spacer></v-spacer>
      <div>
        <v-btn
          icon
          value="account"
          @click="$router.push({name:'login'})"
        >
          <v-icon top>
            mdi-account
          </v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-main id="main" style="display: flex; justify-content: center; background-color: #fafafa;">
      <router-view/>
    </v-main>
    
    <v-bottom-navigation
      light
      app
      style="background:#FFFFFF; border-radius: 5px, 5px, 0, 0;"
    >
      <v-btn
        value="rank"
        style="background-color: #FFFFFF;"
        class="mt-1"
        @click="$router.push({name:'rank'})"
      >
        <span>랭킹</span>

        <v-icon>mdi-podium-gold</v-icon>
      </v-btn>

      <v-btn 
        value="point" 
        style="background-color: #FFFFFF;"
        class="mt-1"
        @click="$router.push({name:'map'})"
      >
        <span>지도</span>

        <v-icon>mdi-map-marker-radius-outline</v-icon>
      </v-btn>

      <v-btn 
        fab
        style="background-color: #FFFFFF;"
        large
      >
<!--       <v-icon>mdi-camera-iris</v-icon> --> 
        <div class="home-btn" style="width:80px;">
        </div>
      </v-btn>

      <v-btn
        value="weather"
        style="background-color: #FFFFFF;"
        class="mt-1"
        @click="$router.push({name:'weather'})"
      >
        <span>날씨</span>

        <v-icon>mdi-weather-sunny</v-icon>
      </v-btn>

      <v-btn
        value="search"
        style="background-color: #FFFFFF;"
        class="mt-1"
        @click="$router.push({name:'search'})"
      >
        <span>검색</span>

        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-btn 
      outlined
      fab
      value="home" 
      style="background-color: #FFFFFF;overflow:hidden;z-index:10; position:fixed;left: 50%;transform: translate(-50%, 0);bottom:0px; box-shadow: 0 3px 20px 1px rgba(0,0,0,.2);"
      x-large
      color="white"
      class="mb-2"
      @click="$router.push({name:'home'})"
    >
      <!-- <div class="home-btn"> -->
      <img
        :src="require('./assets/small_logo.png')"
        contain
        class="shrink"
        style="height:35px;transform: rotate(25deg);"
      />
    </v-btn>
  </v-app>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'App',

    components: {

    },

    data () {
      return {
        value: 1,
        active: true,
      }
    },

    created(){
      
    },
    mounted(){
      // this.getUserId()

    },
    methods: {
      ...mapActions(['snackbarCookie','snackbarCookie']),

      getUserId(){
        if(this.$store.state.userInfo){
          this.userId = this.$store.state.userInfo.nickname
        }
      },

    },
  };
</script>

<style scoped>


</style>
