// main.js

import '@fortawesome/fontawesome-free/css/all.min.css';
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css"; // Tailwind + global reset

const app = createApp(App);
app.use(router);
app.mount("#app");

