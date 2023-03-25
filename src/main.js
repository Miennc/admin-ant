import {createApp} from "vue";
import {createPinia} from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import "./assets/tailwind.css";
import Antd from "@/plugins/Antd";
import Utils from "@/plugins/Utils";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);





const options = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
}

app.use(Toast, options);
app.use(createPinia());
app.use(router);
app.use(Antd);
app.use(Utils);

app.mount("#app");
