const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true),
      }),
    ],
  },

  devServer: {
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_URL || "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        // ✅ No pathRewrite unless needed
        // pathRewrite: { "^/api": "" }, // Only use if your backend expects routes without /api
      },
    },
  },
});
