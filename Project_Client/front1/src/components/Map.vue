<template>
  <v-container>
    <v-card       
    light
    class="mx-auto pa-2 pb-10"
    max-width="400"
    
    >
      <v-card-title>
          낚시 포인트 갤러리
      </v-card-title>
      <v-row class="pa-5" justify="center">
        <v-col cols="12">
          <v-row justify="center">
            <v-btn color="#398DFF" rounded dark @click="setMarker" class="mx-5">이 위치에서 잡은 물고기 보기</v-btn>
          </v-row>
        </v-col>
      </v-row> 
      <div id="map" @click="mapClick" style="width:100%;height:65vh;"></div>
    </v-card>
  </v-container>
</template>
<script>

  export default {
    name: 'Map',

    data() {
      return{
      centerMarker : null,
      map : null,
      markers : [],
      markersWindow : [],
      customOverlay : [],
    }},

    mounted(){
      //mounted시 카카오 지도 초기화
      if(window.kakao && window.kakao.maps){
        this.initMap()
      }
      else{
        const script = document.createElement("script")

        script.onload = () => kakao.maps.load(this.initMap)
        script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=9bb492ef1658739507932e6a0821d59b"

        document.head.appendChild(script)
      }
    },

    methods:{

      getLocation(){
        return new Promise(resolve=>{
          navigator.geolocation.getCurrentPosition(function(pos){

            //geolocation 권한이 존재할 경우, 현재위치를 가져옴
            let location = {}

            location.latitude = pos.coords.latitude
            location.longitude = pos.coords.longitude

            return resolve(location)
          },function(error){

            //geolocation 권한이 존재하지않을 경우, 기본값을 전달
            let location = {'latitude' : 33.450701, 'longitude' : 126.570667}
            return resolve(location)
          })
        })
      },


      async initMap(){
        //맵 초기화
        //기본 위치 데이터, geolocation사용불가능할때 사용
        let location = {'latitude' : 33.450701, 'longitude' : 126.570667}

        //geolocation이 할당되어있다면 실행, 권한여부 상관하지않음
        if(navigator.geolocation)
        {
          //geolocation.getCurrentPosition이 비동기함수로 동작, 동기화를 위해 Promise 사용
          location = await this.getLocation()
        }

        //맵을 할당할 위치와 지도 초기위치를 설정
        const container = document.getElementById("map")
        const options = {
          center : new kakao.maps.LatLng(location.latitude, location.longitude),
          level : 8,
        }

        //카카오지도API를 활용해서 지도 생성
        this.map = new kakao.maps.Map(container, options)
        
        //중앙을 표시하는 마커 생성(데이터 불러올 공간의 중심점)
        this.centerMarker = new kakao.maps.Marker({
          position : this.map.getCenter()
        })

        this.centerMarker.setMap(this.map)
      },

      async setMarker(){
        //맵 중심데이터 가져오기, express로 전송
        let centerData = this.map.getCenter()
        let getData

        //서버로부터 데이터 가져오기
        //await this.axios.post('http://localhost:3000/map/center', centerData)
        await this.axios.post('https://nunukang.shop/map/center', centerData)
        .then(function(response){
          getData = response.data
        })
        .catch(function(error){
          if(error) throw error
        })

        //마커를 담을 공간 + 기존 마커 초기화(메모리 확인필요), 할당된 인포윈도우도 초기화
        for(let i=0;i<this.markers.length;i++)
        {
          this.markersWindow[i].close()
          this.markers[i].setMap(null)
        }
        this.markers = []
        this.markersWindow = []

        //카카오 지도 마커 공통 이미지 설정
        let imageSize = new kakao.maps.Size(30,30)
        let imageOption = {offset : new kakao.maps.Point(10,20)}

        for(let i=0;i<getData.length;i++)
        {
          //카카오 지도 마커 개별 마커 이미지 설정
          let imageSrc = 'data:image/jpg;base64,' + getData[i].image

          let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

          //카카오 지도 개별 마커 위치 설정
          //let position = new kakao.maps.LatLng(...markerPositions[i])
          let position = new kakao.maps.LatLng(getData[i].latitude, getData[i].longitude)

          //카카오 지도 마커 표시 + 마커 객체 저장
          this.markers.push(new kakao.maps.Marker({
            map : this.map,
            position : position,
            image : markerImage
          }))
         
          //인포윈도우 방식
          //인포윈도우 초기화
          let infoWindowContent = '<div">' + getData[i].fishType + ' ' +getData[i].fishLength +'</div>'
          let infoWindowPosition = new kakao.maps.LatLng(position)

          //인포윈도우 생성
          let infoWindow = new kakao.maps.InfoWindow({
            position : infoWindowPosition,
            content : infoWindowContent
          })

          //인포윈도우 지도에 표시
          infoWindow.open(this.map, this.markers[i])

          //인도윈도우 객체를 관리하기 위한 저장
          this.markersWindow.push(infoWindow)

          // //오버레이 방식
          // let content = document.createElement('div')
          // content.innerHTML = getData[i].fishType + ' ' + getData[i].fishLength
          // content.className = 'overlay'

          // //오버레이 이벤트 등록, 클릭으로만 작동하도록 구성
          // kakao.maps.event.addListener(this.markers[i], 'click', ()=>{
          //   if(this.customOverlay[i] == undefined) {
              

          //     let data = new kakao.maps.CustomOverlay({
          //       map : this.map,
          //       content : content,
          //       position : position
          //     })

          //     let overlayData = {data : data, render : true}

          //     this.customOverlay[i] = overlayData

          //     this.customOverlay[i].data.setMap(this.map)
          //   }
          //   else if(this.customOverlay[i].render == true){
          //     this.customOverlay[i].render = false

          //     this.customOverlay[i].data.setMap(null)
          //   }
          //   else{
          //     this.customOverlay[i].render = true

          //     this.customOverlay[i].data.setMap(this.map)
          //   }
          // })
        }
      },

      mapClick(){
        //맵 클릭시 마커를 중앙으로 이동
        let latlng = this.map.getCenter()
        this.centerMarker.setPosition(latlng)
      },
    }
  }
</script>
