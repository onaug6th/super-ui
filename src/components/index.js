//  全量注册组件文件

import pagination from "./pagination";
import table from "./table";
import dropdown from "./dropdown";
import select from "./select";

const components = [pagination, table, dropdown, select];

const install = Vue => {
  if (install.installed) {
    return;
  }
  components.forEach(Component => {
    Vue.component(Component.name, Component);
  });
};

//  如果浏览器环境且拥有全局Vue，则自动安装组件
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  pagination,
  table,
  dropdown,
  select
};
