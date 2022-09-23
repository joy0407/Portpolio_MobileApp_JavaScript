<template>
  <v-container>
    <v-card
      light
      class="mx-auto pa-2"
      max-width="400"
    >
      <v-card-title>
        실시간 해양 날씨
      </v-card-title>
      <v-list-item two-line>
        <v-list-item-content>
          <v-select
            :items="locationFront"
            v-model="locationFrontSelect"
            @change="changeLocationFront"
            dense
          ></v-select>
          <v-list-item-title class="text-h5">
            <v-select
            :items="locationEnd[locationEndIndex]"
            v-model="locationEndSelect"
            @change="changeLocationEnd"
            dense
            color="cyan"
            rounded
            outlined
          ></v-select>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-card-text>
        <v-row align="center">
          <v-col
            style="display:flex; align-items:center; justify-content: center;"
            class="text-h5"
            cols="6"
          >
            {{todayWeatherData.day}} {{todayWeatherData.weather}}
          </v-col>
          <v-col style="display:flex; align-items:center; justify-content: center;" cols="6">
            <template>
              <div style="display:flex; align-items:center; justify-content: center;" v-if="todayWeatherData.weather=='맑음'">
                <v-img
                :src="require('../assets/sunny.png')"
                alt="Sunny image"
                width="92"
                ></v-img>
              </div>
              <div style="display:flex; align-items:center; justify-content: center;" v-else-if="todayWeatherData.weather=='흐림'">
                <v-img
                :src="require('../assets/darkSky.png')"
                alt="darkSky image"
                width="92"
                ></v-img>
              </div>
              <div style="display:flex; align-items:center; justify-content: center;" v-else-if="todayWeatherData.weather=='구름많음'">
                <v-img
                :src="require('../assets/manyCloud.png')"
                alt="manyCloud image"
                width="92"
                ></v-img>
              </div>
              <div style="display:flex; align-items:center; justify-content: center;" v-else-if="todayWeatherData.weather=='비'">
                <v-img
                :src="require('../assets/rain.png')"
                alt="rain image"
                width="92"
                ></v-img>
              </div>
              <div style="display:flex; align-items:center; justify-content: center;" v-else>
                <v-img
                :src="require('../assets/darkSky.png')"
                alt="darkSky image"
                width="92"
                ></v-img>
              </div>
            </template>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-subtitle style="display:flex; align-items:center; justify-content: center;" >풍속</v-list-item-subtitle>
        <v-list-item-subtitle style="display:flex; align-items:center; justify-content: center;" >{{todayWeatherData.windSpeed}}m/s</v-list-item-subtitle>
      </v-list-item>

      <v-list-item>
        <v-list-item-subtitle style="display:flex; align-items:center; justify-content: center;">풍향</v-list-item-subtitle>
        <v-list-item-subtitle style="display:flex; align-items:center; justify-content: center;">{{todayWeatherData.windDir}}</v-list-item-subtitle>
      </v-list-item>

      <v-list-item>
        <v-list-item-subtitle style="display:flex; align-items:center; justify-content: center;">파고</v-list-item-subtitle>
        <v-list-item-subtitle style="display:flex; align-items:center; justify-content: center;">{{todayWeatherData.seaHeight}}m</v-list-item-subtitle>
      </v-list-item>

      <v-divider></v-divider>

      <v-list class="transparent">
        <v-list-item
          style="display:flex; align-items:center; justify-content: center;"
          v-for="item in currnetLocationWeatherData"
          :key="item.index"
        >
          <v-list-item-title style="display:flex; align-items:center; justify-content: center;">{{ item.day }}</v-list-item-title>

          <v-list-item-title style="display:flex; align-items:center; justify-content: center;">{{ item.time }}</v-list-item-title>

          <v-list-item-title style="display:flex; align-items:center; justify-content: center;">
            <template>
              <div style="display:flex; align-items:center; justify-content: center;" v-if="item.weather=='맑음'">
                <v-img
                :src="require('../assets/sunny.png')"
                alt="Sunny image"
                width="30"
                ></v-img>
              </div>
              <div style="display:flex; align-items:center; justify-content: center;" v-else-if="item.weather=='흐림'">
                <v-img
                :src="require('../assets/darkSky.png')"
                alt="darkSky image"
                width="30"
                ></v-img>
              </div>
              <div style="display:flex; align-items:center; justify-content: center;" v-else-if="item.weather=='구름많음'">
                <v-img
                :src="require('../assets/manyCloud.png')"
                alt="manyCloud image"
                width="30"
                ></v-img>
              </div>
              <div style="display:flex; align-items:center; justify-content: center;" v-else-if="item.weather=='비'">
                <v-img
                :src="require('../assets/rain.png')"
                alt="rain image"
                width="30"
                ></v-img>
              </div>
              <div style="display:flex; align-items:center; justify-content: center;" v-else>
                <v-img
                :src="require('../assets/darkSky.png')"
                alt="darkSky image"
                width="30"
                ></v-img>
              </div>
            </template>

          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>
<script>
  export default {
    name: 'Weather',
    data () {
      return {
        labels: ['SU', 'MO', 'TU', 'WED', 'TH', 'FR', 'SA'],
        time: 0,
        forecast: [
          { day: 'Tuesday', icon: 'mdi-white-balance-sunny', temp: '24\xB0/12\xB0' },
          { day: 'Wednesday', icon: 'mdi-white-balance-sunny', temp: '22\xB0/14\xB0' },
          { day: 'Thursday', icon: 'mdi-cloud', temp: '25\xB0/15\xB0' },
        ],

        locationFront : ['서해북부', '서해중부', '서해남부', '남해서부', '남해동부', '제주도', '동해남부', '동해중부', '동해북부'],
        locationEnd : [['서해북부 앞바다', '서해북부 먼바다'],
                      ['서해중부 앞바다', '서해중부 안쪽먼바다', '서해중부 바깥먼바다', '인천, 경기 북부앞바다', '인천, 경기 남부앞바다', '충남 북부앞바다', '충남 남부 앞바다'],
                      ['서해남부 북쪽바깥먼바다', '서해남부 북쪽안쪽먼바다', '서해남부 앞바다', '서해남부 남쪽안쪽먼바다', '서해남부 남쪽바깥먼바다', '전북 북부앞바다', '전북 남부앞바다', '전남 북부서해앞바다', '전남 중부서해앞바다', '전남 남부서해앞바다'],
                      ['남해서부 서쪽먼바다', '남해서부 앞바다', '남해서부 동쪽먼바다', '전남 서부남해앞바다', '전남 동부남해앞바다'],
                      ['남해동부 앞바다', '남해동부 안쪽먼바다', '남해동부 바깥먼바다', '경남 서부남해앞바다', '경남 중부남해앞바다', '거제시 동부앞바다', '부산 앞바다'],
                      ['제주도 남서쪽안쪽먼바다', '제주도 앞바다', '제주도 남동쪽안쪽먼바다', '제주도 남쪽바깥먼바다', '제주도 북부앞바다', '제주도 동부앞바다', '제주도 서부앞바다', '제주도 남부앞바다'],
                      ['동해남부 앞바다', '동해남부 북쪽안쪽먼바다', '동해남부 북쪽바깥먼바다', '동해남부 남쪽안쪽먼바다', '동해남부 남쪽바깥먼바다', '경북 북부앞바다', '경북 남부앞바다', '울산 앞바다'],
                      ['동해 중부앞바다', '동해 중부안쪽먼바다', '동해 중부바깥먼바다', '강원 북부앞바다', '강원 중부앞바다', '강원 남부앞바다'],
                      ['동해북부 앞바다', '동해북부 먼바다']],
        locationFrontIndex : 0,
        locationEndIndex : 0,
        locationFrontSelect : "서해북부",
        locationEndSelect : "서해북부 앞바다",
        currnetLocationWeatherData : [],
        todayWeatherData : {"location" : "", "day" : "", "weather" : "", "time" : "", "windSpeed" : "", "windDir" : "", "seaHeight" : ""}

      }
    },

    async mounted(){
      let sendData = {location : this.locationEndSelect}

      //await this.axios.post('http://localhost:3000/weather/dailyWeather',sendData)
      await this.axios.post("https://nunukang.shop/weather/dailyWeather",sendData)
        .then(resp => {
          this.currnetLocationWeatherData = resp.data
        })
        .catch(err => {
          if(err) throw err
      })

      //0번데이터는 오늘 날씨데이터, 오전 또는 오후 데이터
      this.todayWeatherData = this.currnetLocationWeatherData[0]
    },

    methods:{

      //상위 지역정보를 설정하는 이벤트 함수, 하위 지역정보를 추가로 설정하는 함수를 호출 후 종료
      changeLocationFront(){


        for(let i=0;i<this.locationFront.length;i++)
        {
          if(this.locationFrontSelect == this.locationFront[i])
          {
            //선택한 상위지역의 첫번째 하위 지역정보를 설정
            //해당과정이 없으면 하위 select박스 내용이 공란으로 처리됨
            this.locationEndIndex = i
            this.locationEndSelect = this.locationEnd[i][0]
            this.changeLocationEnd()
            return
          }
        }
      },

      //하위 지역정보를 설정하는 이벤트 함수, 서버에서 직접 필요한 데이터를 요청
      async changeLocationEnd(){

        let sendData = {location : this.locationEndSelect}

        //await this.axios.post('http://localhost:3000/weather/dailyWeather',sendData)
        await this.axios.post("https://nunukang.shop/weather/dailyWeather",sendData)
          .then(resp => {
            this.currnetLocationWeatherData = resp.data
          })
          .catch(err => {
            if(err) throw err
          })

          //html v-for문에서 키값으로 활용하기 위해서 index 할당, 실제로 노출될 데이터는 아님
          for(let i=0;i<this.currnetLocationWeatherData.length;i++)
          {
            this.currnetLocationWeatherData.index = i
          }

          //0번데이터는 오늘 날씨데이터, 오전 또는 오후 데이터
          this.todayWeatherData = this.currnetLocationWeatherData[0]

      },


    }
  }
</script>
