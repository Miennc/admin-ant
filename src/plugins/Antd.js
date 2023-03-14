import Antd, { notification } from "ant-design-vue";
import "ant-design-vue/dist/antd.min.css";
notification.config({
  maxCount: 3,
});
export default {
  install: (app) => {
    app.use(Antd);
  },
};
