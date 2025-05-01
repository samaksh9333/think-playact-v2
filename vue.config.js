// vue.config.js
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,

  // Proxy /api/* to your backend during development
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        // If your API uses a different path, adjust pathRewrite accordingly:
        // pathRewrite: { "^/api": "" }
      },
    },
  },

  // When you build for production, Vue will serve from "/" by default.
  // If you ever need a sub-directory, set publicPath here.
  // publicPath: process.env.NODE_ENV === "production" ? "/your-subfolder/" : "/",
});
