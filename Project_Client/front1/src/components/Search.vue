<template>
  <v-container>
    <!-- <v-card       
      light
      class="mx-auto pa-2"
      max-width="400"
    > -->
      <v-row class="mt-10">
        <v-col class="mx-auto" cols="11" sm="6">
          <v-text-field
            class="mx-auto"
            solo
            rounded
            label="어종 정보"
            append-icon="mdi-magnify"
            @keyup.prevent="search"
            v-model="query"
          ></v-text-field>
        </v-col>
      </v-row>
        <v-card class="mx-5" style="border-radius:20px;" v-for="(value, index) in data" :key="index">
          <v-card-subtitle><h4>{{value._source.어종}}</h4></v-card-subtitle>
          <v-card-text>서식지 : {{value._source.서식지}}</v-card-text>
          <v-card-text>산란기 : {{value._source.산란기}}</v-card-text>
          <v-card-text>색깔 : {{value._source.색깔}}</v-card-text>
          <v-card-text>분포 : {{value._source.분포}}</v-card-text>
          <v-card-text>형태 : {{value._source.형태}}</v-card-text>
          <v-card-text color="blue"><h6>참고문헌 : {{value._source.참고문헌}}</h6></v-card-text>
        </v-card>
  </v-container>
</template>
<script>
  export default {
    name: 'Search',

    data() {
      return{
        query:'',
        data:[]
      }
    },
    methods: {
      search() {
        this.axios.get("https://nunukang.shop/search?q=" + this.query)
              .then(resp => {
                console.log(resp.data._source);
                this.data = resp.data;
          })
      }
    }
  }
</script>
