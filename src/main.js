import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

/****************  全量使用 ****************/
// import superUI from "@onaug6th/super-ui";
// import "@onaug6th/super-ui/lib/index/style.css";
// Vue.use(superUI);
/****************  全量使用 ****************/




/****************  基础组件使用 ****************/
import superUI_base from "@onaug6th/super-ui/lib/base";
import "@onaug6th/super-ui/lib/base/style.css";
Vue.use(superUI_base);

//  使用按需引用组件
import { SDropdown } from "@onaug6th/super-ui";
Vue.use(SDropdown);
/****************  基础组件使用 ****************/




new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
