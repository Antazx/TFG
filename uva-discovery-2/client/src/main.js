import Vue from 'vue';
import '@babel/polyfill';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import sockets from './plugins/socket';
import DatetimePicker from 'vuetify-datetime-picker';

Vue.config.productionTip = false;

Vue.use(require('vue-moment'));
Vue.use(DatetimePicker);

/**
 * Workaround for https://github.com/vuetifyjs/vuetify/issues/9999
 */
const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.';
Vue.config.warnHandler = function(msg, vm, trace) {
  // `trace` is the component hierarchy trace
  if (msg === ignoreWarnMessage) {
    msg = null;
    vm = null;
    trace = null;
  }
};

new Vue({
  router,
  store,
  vuetify,
  sockets,
  render: (h) => h(App),
}).$mount('#app');
