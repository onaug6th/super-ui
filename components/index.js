import pagination from './pagination/index.vue';
import superTable from './table';

const components = [
  pagination,
  superTable
];

const install = Vue => {
  if (install.installed) {
    return
  }
  components.forEach(Component => {
    Vue.component(Component.name, Component);
  });
}

//  如果浏览器环境且拥有全局Vue，则自动安装组件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  pagination
}

export default {
  install
}
