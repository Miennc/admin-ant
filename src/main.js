import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import "./assets/tailwind.css";
import Antd from "@/plugins/Antd";
import Utils from "@/plugins/Utils";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Antd);
app.use(Utils);

app.mount("#app");
