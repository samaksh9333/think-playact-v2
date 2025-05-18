import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// ✅ Import and run Firebase config (this initializes the app)
import "@/firebase/firebase"; // make sure firebase.js is in src/

const app = createApp(App);
app.use(router);
app.mount("#app");
