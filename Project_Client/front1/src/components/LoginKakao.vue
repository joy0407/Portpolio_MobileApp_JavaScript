<template>
    <v-container>
        <v-card>
            로그인 중
        </v-card>
    </v-container>
</template>

<script>
import axios from 'axios'

const kakaoHeader = {
    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
  };

  const getKakaoToken = async (code) => {
    // console.log('loginWithKakao');
    try {
        const data = {
            grant_type: 'authorization_code',
            client_id: 'b1e391b01ea6209470f58d4a56becb42', //RESTAPI Key
            redirect_uri: 'https://nunutest.shop/login/kakao',
            code: code,
        };

        const queryString = Object.keys(data)
            .map(k => k + '=' + data[k])
            .join('&');
        // console.log(queryString)
        const result = await axios.post('https://kauth.kakao.com/oauth/token', queryString, { headers: kakaoHeader });
        console.log('카카오 토큰', result);
        
        const userData = await getKakaoUserInfo(result.data.access_token)

        return userData;

    } catch (e) {
      console.log(e)
        // this.$router.push({name:'redirect'});
    }
  };

  //계정정보요청
  const getKakaoUserInfo = async function(accessToken){
      let data = '';
      Kakao.Auth.setAccessToken(accessToken)
      await Kakao.API.request({
          url: "/v2/user/me",
          success: function (res) {
            data = res
          },
          fail: function (err) {
              console.log(err);
              alert('다시 로그인 해주세요.')
              this.$router.push({name:'login'})
          },
      });
      // console.log('카카오 계정 정보', data);
      return data
  }


  
  export default {
    name: 'Redirect',

    components: {

    },

    data () {
      return {
      }
    },

    async created(){
      if(this.$route.query.code){
        const data = await getKakaoToken(this.$route.query.code)
        // console.log('created훅',data)
        const social = "kakao"
        await this.$store.dispatch("userGetAction", {data, social});
        this.$router.push({name:'home'});
        }
    },
  };
</script>