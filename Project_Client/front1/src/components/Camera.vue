
<template>
    <v-container>
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
            shaped
            style="height:50px; opacity: 85%; margin-top: 100px; z-index: 20000;"
            top
        >
            환영합니다 ! <strong>{{ this.userInfo.nickname }}</strong> 님
        </v-snackbar>
        <v-card       
        light
        class="mx-auto pa-2"
        max-width="400"
        >
            <!-- <v-card-title>{{ this.$store.state.userInfo }}</v-card-title> -->

            <div id="camera">
                <!-- <button id="flip-button">카메라전환</button> -->
                <img src="//:0" alt="" ref="output" id="camera--output">

                <canvas id="camera--sensor" ref="canvas"></canvas>

                <video id="camera--view" ref="camera" autoplay playsinline></video>

            </div>

        </v-card>
        <v-btn 
            outlined
            fab
            :style="cameraBtn"
            x-large
            color="light-blue"
            class="mb-2"
            @click="capture"
        >
            <!-- <div class="home-btn"> -->
            <img
                :src="require('../assets/small_logo.png')"
                contain
                class="shrink"
                style="height:35px;transform: rotate(25deg);"
            />
        </v-btn>

        
        <div v-if="!checkPopUpCookies" refs="pop" id="pop" :style="popDisplay">
            <v-card class="guide_box mx-auto" >
                <div class="guide">
                    <span>누가 누가 강태공</span>
                    <div class="bold" id="guide_title">즐거움으로 연결된<br>낚시인들의 길이배틀 그라운드,<br>누누강</div>
                    <span>
                        <pre>
    딥러닝 기술을 적용한 누누강의 카메라로
    월척의 어종과 길이, 점수를 확인해보세요

    다른 유저들보다 얼마나 더 긴 월척을 잡았는지
    배틀에 참전하여 볼까요?

    이 구역의 강태공은 나야 나!
                        </pre>
                    </span>
                    <img :src="require('../assets/fish(3).png')" style="width: 100px; margin-top: 50px;">
                    <div class="bold" id="photo_guide">나의 월척 찍기</div>
                    <span>
                        <pre>
    내가 잡은 물고기와 담뱃갑을
    한 프레임 안에 놓아주세요

    카메라가 잘 인식할 수 있도록
    가까이에서 찍는 센스!

                        </pre>
                    </span>
                    <img :src="require('../assets/camera.png')" style="width: 100px;margin: 20px;">
                    <div id="sample_t" class="bold">예시 사진</div>
                    <img class="fish_sample" :src="require('../assets/감성돔.jpg')" >
                    <br> 
                    <v-row class="mb-4">
                    <v-col cols="12" justify="center" class="mb-10">
                        <v-btn large rounded dark color="#6aafe6" refs="cookie_btn" type="button" @click="todayCloseWin">
                        <strong>오늘 하루 보지않기</strong>
                        </v-btn>
                    </v-col>
                    <v-col cols="12" justify="center" class="mb-20">
                        <v-btn large rounded dark color="#6aafe6" type="button" @click="popClose">
                        <strong>배틀 참전</strong>
                        </v-btn>
                    </v-col>
                    </v-row>
                </div>
            </v-card>
        </div>
    </v-container>
</template>
 
<script>

    import { mapActions } from 'vuex';
 
    export default {
        name: "Camera",
        components: {

        },
        data() {
            return {
                isCameraOpen: false,
                timeout: 3500,
                items: [], 
                snackbar: false,
                latitude:null,
                longitude:null,
                userInfo: '',
                popDisplay:"display: flex;",
                checkPopUpCookies : false,
                cameraBtn:"display: none; background-color: #FFFFFF;overflow:hidden;z-index:100; position:fixed;left: 50%;transform: translate(-50%, 0);bottom:0px; box-shadow: 0 3px 20px 1px rgba(0,0,0,.2);"
            }
        },
        created(){

        },
        mounted(){
            this.cameraStart()
            this.getCurrentPosition()
            this.getUserInfo()
            // console.log('camera:', this.userId, this.$store.state.userStore.userInfo, this.$store.state.userStore.snackbarCookie)
            if(this.userInfo && this.$store.state.userStore.snackbarCookie == 0){
                this.snackbar = true
                this.snackbarCookie()
            }

            if(this.$cookies.isKey("CameraPopUp"))
                this.checkPopUpCookies = true
        },
        methods: {
            ...mapActions(['fishTmpAction','snackbarCookie']),

            cameraStart(){
                const front = false;
                // const constraints = { video: { width: 340,height: 620, facingMode: (front? "user" : "environment") } };
                const constraints = { video: { facingMode: (front? "user" : "environment") } };
                navigator.mediaDevices.getUserMedia(constraints)
                    .then(stream => {
                        this.$refs.camera.srcObject = stream;
                    })
                    .catch(error => {
                        alert("카메라에 문제가 있습니다.", error);
                    })
                this.cameraBtn = "background-color: #FFFFFF; overflow:hidden; z-index:100; position:fixed; left: 50%;transform: translate(-50%, 0);bottom:0px; box-shadow: 0 3px 20px 1px rgba(0,0,0,.2);" 
            },
 
            stopCameraStream() {
                let tracks = this.$refs.camera.srcObject.getTracks();
                tracks.forEach(track => {
                    track.stop();
                });
                this.cameraBtn = "display:none;"
            },
 
            capture() {
                const FLASH_TIMEOUT = 200;
                let self = this;
                setTimeout(() => {
                    self.$refs.canvas.width = self.$refs.camera.videoWidth
                    self.$refs.canvas.height = self.$refs.camera.videoHeight
                    // console.log(self.$refs.canvas.width,self.$refs.camera.videoWidth)
  
                    const context = self.$refs.canvas.getContext('2d');
                    
                    context.drawImage(self.$refs.camera, 0, 0);
                    const dataUrl = self.$refs.canvas.toDataURL("image/png")
                        //.replace("image/jpg", "image/octet-stream");
                    //self.addToPhotoGallery(dataUrl);
                    self.uploadPhoto(dataUrl);
                    self.stopCameraStream();
                    self.$refs.output.src = dataUrl
                }, FLASH_TIMEOUT);
            },
            async uploadPhoto(dataURL){
                let uniquePictureName = this.generateCapturePhotoName();
                let capturedPhotoFile = this.dataURLtoFile(dataURL, uniquePictureName+'.png')
                let formData = new FormData()

                //촬영한 물고기 이미지 파일
                // console.log('이미지', capturedPhotoFile)
                formData.append('fish', capturedPhotoFile)

                //잡은 물고기 location(위도, 경도)
    
                // console.log('위도',this.latitude)
                formData.append('latitude', this.latitude)
                formData.append('longitude', this.longitude)

                //userId 함께 보내기
                if(this.userInfo.id){
                    console.log('위도',this.userInfo.id)
                    formData.append('userId', this.userInfo.id)
                }else{
                    formData.append('userId', 'geust')
                }

                //Upload image api
                    //await this.axios.post('http://localhost:3000/matchFish/caculateData', formData,{
                    await this.axios.post('https://nunukang.shop/matchFish/caculateData', formData, {
                        headers:{
                            'Content-Type' : 'multipart/form-data',
                        }
                    }).then(resp => {
                        // console.log('성공적 키:', Object.keys(resp.data))
                        //console.log("성공적", resp)
                        //data를 store.state.fishTmp에 저장
                        this.fishTmpAction(resp.data)
                        //응답값 {data:{fishType:"",fishLength:"",imageData:""}}
                        //페이지전환
                        this.$router.push({name:'result'})
                    }).catch(error => {
                        console.log(error) 
                        alert("다시 촬영해 주세요")
                    })

            },
 
            generateCapturePhotoName(){
                return  Math.random().toString(36).substring(2, 15)
            },
 
            dataURLtoFile(dataURL, filename) {
                let arr = dataURL.split(','),
                    mime = arr[0].match(/:(.*?);/)[1], //png
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
 
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                let blob = new Blob([u8arr],{type: mime})
                return new File([blob], filename);
            },

            getCurrentPosition () {
                if (!navigator.geolocation) {
                    alert('위치 정보 제공을 허용해 주세요')
                } else {

                    navigator.geolocation.getCurrentPosition(pos => {
                        // console.log(pos.coords.latitude)
                        this.latitude = pos.coords.latitude;
                        this.longitude = pos.coords.longitude;
                    },this.geolocationError)
                }
            },
            geolocationError () {
                // console.log('위치 정보 찾을 수 없음')
                this.latitude = 0
                this.longitude = 0
            },

            getUserInfo(){
                if(this.$store.state.userStore.userInfo){
                    this.userInfo = this.$store.state.userStore.userInfo
                }
            },
            popClose(){
                this.popDisplay= "display: none;";
            },
            todayCloseWin(){
                this.$cookies.set("CameraPopUp", "todayClose")
                this.popClose()
            }

        }
    }

</script>
 
<style scoped>
    #camera{
        position: relative;
        width: 340px;
        height: 80vh;
        margin: auto;
        overflow: hidden;
    }
    #camera--view, #camera--sensor, #camera--output{
        position: absolute;
        width: 340px;
        height: 80vh;
        margin: auto;
        object-fit: cover;
    }

    #camera--view, #camera--sensor, #camera--output{
        /* transform: scaleX(-1); */
        filter: FlipH;
    }
    #pop{
      position: fixed;
      flex-direction: column;
      text-align: center;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      z-index: 1000;
      background: rgba(0,0,0,0.2);
  }
  .guide_box{
      padding: 80px 10px;
      margin: auto;
      width: 720px;
      height: 80vh;
      border: none;
      border-radius: 20px;
      text-align: center;
      align-items: center;
      line-height: 20px;
      font-family: plain,"Helvetica Neue",Helvetica,Arial,sans-serif;
      font-weight: bold;
      color: grey;
      word-spacing: -3px;
      background-color: #fff;
      overflow: auto;
      display: flex;
      flex-direction: column;
      text-align: center;
  }
  .guide{
      margin: auto;
      width: 90%;
  }
  .guide div{
      margin: 15px 0px;
      font-size: x-large;
      line-height: 30px;
      color:#000;
  }
  .guide span{
      margin: 40px 0px;
      font-weight:600;
  }
  #sample_t{
      margin: 15px 0px;
      font-size: medium;
  }
  #photo_guide{
      font-size: xx-large;
  }
  .fish_sample{
      width: 320px;
      margin:auto;
      
  }

  /*버튼*/

  .w-btn-blue{
    position: relative;
    border: none;
    display: inline-block;
    border-radius: 15px;
    font-family: "paybooc-Light", sans-serif;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    font-weight: 600;
    transition: 0.25s;
  }

  .w-btn-blue{
    background-color: #6aafe6;
    color: #fff;
  }
  .w-btn-blue:hover{
    letter-spacing: 2px;
    transform: scale(1.2);
    cursor: pointer;
  }

  .w-btn-blue:active{
    transform: scale(1.5);
  }
  #repic{
    margin:5px 10px 20px 5px;
  }

  @media screen and (max-width: 650px){
    .guide_box{
        width: 95%;
        height: 95%;
    }
  }

 
</style>