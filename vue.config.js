module.exports = {
  baseUrl:  "/h5",
  // baseUrl: process.env.BASE_URL || "/",
  lintOnSave: true,
  compiler: false,
  css: {
    sourceMap: !!eval(process.env.GENERATE_CSS_MAP),
    loaderOptions: {
      less: {
        globalVars: require("./theme")
      }
    }
  },
  configureWebpack: {
    output: {
      chunkFilename: "js/[name].js"
    }
  },
  devServer: {
    open: false,
    disableHostCheck: true,
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_HOST,
        changeOrigin: true
      }
    }
  }
};
