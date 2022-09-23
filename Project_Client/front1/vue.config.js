const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  lintOnSave: false,
  devServer: {
    allowedHosts: "all",
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws'
    }	
  },
})
