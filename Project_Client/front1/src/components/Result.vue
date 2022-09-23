<template>
  <v-container>
    <v-card       
      light
      class="mx-auto pa-2"
      max-width="400"
    >
        <v-img
        :src="boxedImg"
        height="500px"
        ></v-img>

        <v-card-title>
        {{spc}}
        </v-card-title>

        <v-card-title>
        길이 : {{cm}} cm
        </v-card-title>

    </v-card>
  </v-container>
</template>
<script>

  export default {
    name: 'Result',

    data() {
        return {
            show: false,
            userId: "",
            boxedImg: "",
            spc: "",
            cm: ""
        };
    },
    methods: { 
    },
    mounted() {
        //const data = this.$store.state.fishTmp.resultImg;
        let data = this.$store.state.userStore.fishTmp
            // 이미지를 base64 str data 로 받았을때
        this.boxedImg = 'data:image/jpeg;base64,' + data.imageData;
            // raw binary data 로 이미지를 받았을 때
        // const blob = new Blob([data.imageData])
        // this.boxedImg = URL.createObjectURL(blob)
        this.spc = data.fishType
        this.cm = data.fishLength
    }
  }
</script>
