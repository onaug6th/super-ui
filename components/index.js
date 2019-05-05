import pagination from './pagination';
import table from './table';
import dropdown from './dropdown';
import select from './select';
import scrollbar from './scrollbar';
import loading from './loading';

const components = [
  pagination,
  table,
  dropdown,
  select,
  scrollbar
];

const install = Vue => {
  if (install.installed) {
    return;
  }
  components.forEach(Component => {
    Vue.component(Component.name, Component);
  });
  Vue.use(loading.directive);
  Vue.prototype.$loading = loading.service;
}

//  如果浏览器环境且拥有全局Vue，则自动安装组件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  pagination,
  table,
  dropdown,
  select,
  scrollbar,
  loading
}

export default {
  install
}
