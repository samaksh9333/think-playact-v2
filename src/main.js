import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // <-- Important

const app = createApp(App);
app.use(router); // <-- Important
app.mount("#app");
