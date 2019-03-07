import Vue from 'vue';
import App from './App.vue';
import router from './router';
import SuperUI from '../components';

Vue.config.productionTip = false;

Vue.use(SuperUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
