// vue.config.js
const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        // Silences the hydration-mismatch warning and allows proper tree-shaking
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true),
      }),
    ],
  },

  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        // if your backend expects no "/api" prefix, uncomment next line:
        // pathRewrite: { "^/api": "" },
      },
    },
  },

  // If you ever deploy under a subfolder, uncomment and adjust publicPath:
  // publicPath: process.env.NODE_ENV === "production" ? "/subfolder/" : "/",
});
