import App from "@/App.vue";
import { pinia } from "@/pinia";
import { installPlugins } from "@/plugins";
import { router } from "@/router";
import { createApp } from "vue";

import "normalize.css";
import "nprogress/nprogress.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "vxe-table/lib/style.css";
import "@@/assets/styles/index.scss";
import "virtual:uno.css";

const app = createApp(App);

installPlugins(app);

app.use(pinia).use(router);

router.isReady().then(() => {
  app.mount("#app");
});
